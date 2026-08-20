import { Prisma } from '@prisma/client';

/**
 * Resolves a translated string from a JSON locale map or plain string.
 * Falls back safely to defaultLocale, requestedLocale, or string representation.
 */
export function resolveTranslation(
  json: Prisma.JsonValue | null | undefined,
  requestedLocale: string = 'tr',
  supportedLocales: string[] = ['tr', 'en', 'ar'],
  defaultLocale: string = 'tr',
): string {
  if (json === null || json === undefined) {
    return '';
  }
  if (typeof json === 'string') {
    return json;
  }
  if (typeof json !== 'object' || Array.isArray(json)) {
    return String(json);
  }

  const map = json as Record<string, any>;
  const effective = Array.isArray(supportedLocales) && supportedLocales.includes(requestedLocale)
    ? requestedLocale
    : defaultLocale;

  if (map[effective] && typeof map[effective] === 'string') {
    return map[effective];
  }
  if (map[defaultLocale] && typeof map[defaultLocale] === 'string') {
    return map[defaultLocale];
  }

  const values = Object.values(map).filter((v) => typeof v === 'string');
  if (values.length > 0) {
    return values[0];
  }

  return '';
}
