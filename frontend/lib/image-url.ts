/**
 * Resolves an image URL safely.
 * - If the URL is an ISP-blocked *.r2.dev development domain, proxies it via backend streaming endpoint.
 * - If the URL is relative (/uploads/...), prefixes with NEXT_PUBLIC_API_URL or backend URL.
 * - Otherwise returns the URL as-is.
 */
export function resolveImageUrl(url: string | null | undefined): string {
  if (!url) return '';
  const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'https://digitalmenu-backend-production.up.railway.app').replace(/\/$/, '');

  if (url.includes('.r2.dev/')) {
    const key = url.split('.r2.dev/')[1];
    return `${apiUrl}/upload/file/${key}`;
  }

  if (url.startsWith('/')) {
    return `${apiUrl}${url}`;
  }

  return url;
}
