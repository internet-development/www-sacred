const ABSOLUTE_SCHEME_RE = /^[a-zA-Z][a-zA-Z\d+.-]*:/;

export interface SafeImageSrcOptions {
  /**
   * Path to the proxy endpoint used for remote images. Defaults to `/api/image-proxy`.
   * The value can be absolute or relative; relative paths will be treated as same-origin.
   */
  proxyEndpoint?: string;
  /**
   * If `false`, never proxy remote URLs and always return the original value.
   */
  allowProxy?: boolean;
}

/**
 * Returns an image URL that is safe to use with a canvas by proxying cross-origin
 * http(s) resources through the app's image proxy. Relative paths, same-origin
 * absolute URLs, and data/blob URIs are returned untouched.
 */
export function getSafeImageSrc(src?: string | null, options: SafeImageSrcOptions = {}): string | undefined {
  if (!src) return undefined;

  const trimmed = src.trim();
  if (!trimmed) return undefined;

  const { proxyEndpoint = '/api/image-proxy', allowProxy = true } = options;
  const normalizedProxy = normalizeProxyEndpoint(proxyEndpoint);

  // Already proxied (relative form) – return as-is.
  if (
    proxyEndpoint &&
    (trimmed.startsWith(normalizedProxy.endpoint) || trimmed.startsWith(normalizedProxy.path))
  ) {
    return trimmed;
  }

  // Preserve data/blob URLs – they are already safe for canvas usage.
  if (/^(data:|blob:)/i.test(trimmed)) {
    return trimmed;
  }

  const hasScheme = ABSOLUTE_SCHEME_RE.test(trimmed);
  const isProtocolRelative = trimmed.startsWith('//');

  // Plain relative URLs (e.g. "./foo.png", "images/foo.png") are same-origin.
  if (!hasScheme && !isProtocolRelative) {
    return trimmed;
  }

  let resolved: URL;
  try {
    const base = typeof window !== 'undefined' ? window.location.href : 'http://localhost/';
    resolved = new URL(trimmed, base);
  } catch {
    return trimmed;
  }

  // Already proxied (absolute form).
  if (proxyEndpoint && resolved.pathname.startsWith(normalizedProxy.path)) {
    return trimmed;
  }

  const isHttp = resolved.protocol === 'http:' || resolved.protocol === 'https:';
  if (!isHttp) {
    return trimmed;
  }

  if (typeof window !== 'undefined' && resolved.origin === window.location.origin) {
    // Same-origin absolute URL – no need to proxy.
    return trimmed;
  }

  if (!allowProxy) {
    return trimmed;
  }

  const target = normalizedProxy.endpoint || proxyEndpoint;
  return `${target}?url=${encodeURIComponent(resolved.toString())}`;
}

function normalizeProxyEndpoint(endpoint: string): { endpoint: string; path: string } {
  if (!endpoint) {
    return { endpoint, path: endpoint };
  }

  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
    try {
      const url = new URL(endpoint);
      const cleanedEndpoint = url.origin + trimTrailingSlash(url.pathname);
      return {
        endpoint: cleanedEndpoint,
        path: trimTrailingSlash(url.pathname) || '/',
      };
    } catch {
      return { endpoint, path: endpoint };
    }
  }

  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return {
    endpoint: path,
    path: trimTrailingSlash(path) || '/',
  };
}

function trimTrailingSlash(path: string): string {
  if (!path) return path;
  if (path.length > 1 && path.endsWith('/')) {
    return path.replace(/\/+$/, '');
  }

  return path;

}

export default getSafeImageSrc;
