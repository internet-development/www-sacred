export const DISALLOWED_HOST_PATTERNS: RegExp[] = [
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

export function isDisallowedHost(hostname: string): boolean {
  return DISALLOWED_HOST_PATTERNS.some((re) => re.test(hostname));
}

export function buildCORSHeaders(): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Range',
    'Access-Control-Max-Age': '86400',
    'Timing-Allow-Origin': '*',
  };
}

export class ImageProxyError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export interface ImageProxyResult {
  upstream: globalThis.Response;
  headers: Record<string, string>;
}

export async function resolveImageProxyRequest(target: string | null | undefined): Promise<ImageProxyResult> {
  if (!target) {
    throw new ImageProxyError(400, 'Missing required "url" query parameter');
  }

  let remote: URL;
  try {
    remote = new URL(target);
  } catch {
    throw new ImageProxyError(400, 'Invalid URL');
  }

  if (remote.protocol !== 'http:' && remote.protocol !== 'https:') {
    throw new ImageProxyError(400, 'Only http and https protocols are allowed');
  }

  if (isDisallowedHost(remote.hostname)) {
    throw new ImageProxyError(400, 'Refusing to proxy disallowed host');
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
    throw new ImageProxyError(502, 'Failed to fetch the remote resource');
  }

  if (!upstream.ok || !upstream.body) {
    throw new ImageProxyError(502, `Upstream responded with ${upstream.status} ${upstream.statusText}`);
  }

  return {
    upstream,
    headers: buildSuccessHeaders(upstream),
  };
}

export function buildSuccessHeaders(upstream: globalThis.Response): Record<string, string> {
  const headers: Record<string, string> = {
    ...buildCORSHeaders(),
    'Content-Type': upstream.headers.get('content-type') ?? 'application/octet-stream',
    'Cache-Control': 'public, max-age=0, s-maxage=86400, stale-while-revalidate=86400',
  };

  const contentLength = upstream.headers.get('content-length');
  const etag = upstream.headers.get('etag');
  const lastModified = upstream.headers.get('last-modified');

  if (contentLength) headers['Content-Length'] = contentLength;
  if (etag) headers['ETag'] = etag;
  if (lastModified) headers['Last-Modified'] = lastModified;

  return headers;
}
