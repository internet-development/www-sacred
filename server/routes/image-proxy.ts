import { Router, Request, Response } from 'express';

const router = Router();

function buildCORSHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Range',
    'Access-Control-Max-Age': '86400',
    'Timing-Allow-Origin': '*',
  };
}

function errorResponse(res: Response, status: number, message: string) {
  return res
    .status(status)
    .set({
      'Content-Type': 'text/plain; charset=utf-8',
      ...buildCORSHeaders(),
    })
    .send(message);
}

// Simple hostname-based SSRF guard (best-effort; does not resolve DNS/IPs)
const DISALLOWED_HOST_PATTERNS: RegExp[] = [
  /^localhost$/i,
  /^127\.\d{1,3}\.\d{1,3}\.\d{1,3}$/i,
  /^\[?::1\]?$/i,
  /^0\.0\.0\.0$/i,
  /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/i,
  /^192\.168\.\d{1,3}\.\d{1,3}$/i,
  /^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/i,
  /^169\.254\.\d{1,3}\.\d{1,3}$/i,
  /\.local$/i,
];

function isDisallowedHost(hostname: string): boolean {
  return DISALLOWED_HOST_PATTERNS.some((re) => re.test(hostname));
}

// Handle OPTIONS request
router.options('/', (req: Request, res: Response) => {
  res
    .status(204)
    .set(buildCORSHeaders())
    .send();
});

// Handle GET request
router.get('/', async (req: Request, res: Response) => {
  const target = req.query.url as string;

  if (!target) {
    return errorResponse(res, 400, 'Missing required "url" query parameter');
  }

  let remote: URL;
  try {
    remote = new URL(target);
  } catch {
    return errorResponse(res, 400, 'Invalid URL');
  }

  if (remote.protocol !== 'http:' && remote.protocol !== 'https:') {
    return errorResponse(res, 400, 'Only http and https protocols are allowed');
  }

  if (isDisallowedHost(remote.hostname)) {
    return errorResponse(res, 400, 'Refusing to proxy disallowed host');
  }

  let upstream: globalThis.Response;
  try {
    upstream = await fetch(remote.toString(), {
      redirect: 'follow',
      headers: {
        Accept: 'image/*,*/*;q=0.8',
        'User-Agent': 'Mozilla/5.0 (compatible; SacredComputerImageProxy/1.0; +https://internet.dev)',
      },
      cache: 'no-store',
    });
  } catch {
    return errorResponse(res, 502, 'Failed to fetch the remote resource');
  }

  if (!upstream.ok || !upstream.body) {
    return errorResponse(res, 502, `Upstream responded with ${upstream.status} ${upstream.statusText}`);
  }

  // Set response headers
  const headers = buildCORSHeaders();

  const contentType = upstream.headers.get('content-type') ?? 'application/octet-stream';
  const contentLength = upstream.headers.get('content-length');
  const etag = upstream.headers.get('etag');
  const lastModified = upstream.headers.get('last-modified');

  res.set({
    ...headers,
    'Content-Type': contentType,
    'Cache-Control': 'public, max-age=0, s-maxage=86400, stale-while-revalidate=86400',
  });

  if (contentLength) res.set('Content-Length', contentLength);
  if (etag) res.set('ETag', etag);
  if (lastModified) res.set('Last-Modified', lastModified);

  // Stream the response body
  if (upstream.body) {
    const reader = upstream.body.getReader();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        res.write(value);
      }
      res.end();
    } catch (error) {
      console.error('Error streaming response:', error);
      res.destroy();
    }
  }
});

export default router;
