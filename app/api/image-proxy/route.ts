import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function buildCORSHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Range',
    'Access-Control-Max-Age': '86400',
    'Timing-Allow-Origin': '*',
  };
}

function errorResponse(status: number, message: string) {
  return new NextResponse(message, {
    status,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      ...buildCORSHeaders(),
    },
  });
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

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      ...buildCORSHeaders(),
    },
  });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const target = searchParams.get('url');

  if (!target) {
    return errorResponse(400, 'Missing required "url" query parameter');
  }

  let remote: URL;
  try {
    remote = new URL(target);
  } catch {
    return errorResponse(400, 'Invalid URL');
  }

  if (remote.protocol !== 'http:' && remote.protocol !== 'https:') {
    return errorResponse(400, 'Only http and https protocols are allowed');
  }

  if (isDisallowedHost(remote.hostname)) {
    return errorResponse(400, 'Refusing to proxy disallowed host');
  }

  let upstream: Response;
  try {
    upstream = await fetch(remote.toString(), {
      redirect: 'follow',
      headers: {
        Accept: 'image/*,*/*;q=0.8',
        'User-Agent': 'Mozilla/5.0 (compatible; SacredComputerImageProxy/1.0; +https://internet.dev)',
      },
      // Let Next.js/server cache at most on the server for a bit; the route remains dynamic.
      cache: 'no-store',
    });
  } catch {
    return errorResponse(502, 'Failed to fetch the remote resource');
  }

  if (!upstream.ok || !upstream.body) {
    return errorResponse(502, `Upstream responded with ${upstream.status} ${upstream.statusText}`);
  }

  // Prepare passthrough headers while ensuring CORS and cache behavior for canvas usage
  const headers = new Headers(buildCORSHeaders());

  const contentType = upstream.headers.get('content-type') ?? 'application/octet-stream';
  headers.set('Content-Type', contentType);

  const contentLength = upstream.headers.get('content-length');
  if (contentLength) headers.set('Content-Length', contentLength);

  const etag = upstream.headers.get('etag');
  if (etag) headers.set('ETag', etag);

  const lastModified = upstream.headers.get('last-modified');
  if (lastModified) headers.set('Last-Modified', lastModified);

  // Allow CDN/proxy caching for 1 day, clients revalidate as needed
  headers.set('Cache-Control', 'public, max-age=0, s-maxage=86400, stale-while-revalidate=86400');

  return new NextResponse(upstream.body, {
    status: 200,
    headers,
  });
}
