import { Prisma } from '@prisma/client';

/**
 * Resolves a translated string from a JSON locale map.
 * Falls back to defaultLocale, then to the first available locale.
 */
export function resolveTranslation(
  json: Prisma.JsonValue,
  requestedLocale: string,
  supportedLocales: string[],
  defaultLocale: string,
): string {
  const map = json as Record<string, string>;
  const effective = supportedLocales.includes(requestedLocale)
    ? requestedLocale
    : defaultLocale;
  return map[effective] ?? map[defaultLocale] ?? Object.values(map)[0] ?? '';
}
