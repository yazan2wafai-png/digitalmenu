'use client';
import { Nfc3DCanvas } from './Nfc3DCanvas';
import type { Locale } from '@/lib/translations';

export default function NfcProduct3DCanvas({ locale = 'tr' }: { locale?: Locale }) {
  return <Nfc3DCanvas locale={locale} />;
}
export { Nfc3DCanvas };
