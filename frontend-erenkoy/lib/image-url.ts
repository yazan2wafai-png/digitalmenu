/**
 * Resolves an image URL safely.
 * - If the URL is an ISP-blocked *.r2.dev development domain, proxies it via backend streaming endpoint.
 * - If the URL is relative (/uploads/...), prefixes with API URL or proxy.
 * - Otherwise returns the URL as-is.
 */
export function resolveImageUrl(url: string | null | undefined): string {
  if (!url) return '';
  const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'https://digitalmenu-backend-production.up.railway.app').replace(/\/$/, '');

  // Automatically convert any legacy/blocked *.r2.dev URLs to backend stream
  if (url.includes('.r2.dev/')) {
    const filename = url.split('/').pop();
    return `${apiUrl}/upload/file/${filename}`;
  }

  if (url.startsWith('/uploads/')) {
    const filename = url.split('/').pop();
    return `${apiUrl}/upload/file/${filename}`;
  }

  if (url.startsWith('/')) {
    return `${apiUrl}${url}`;
  }

  return url;
}
