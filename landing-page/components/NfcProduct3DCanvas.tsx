'use client';
import { Nfc3DCanvas } from './Nfc3DCanvas';
import type { Locale } from '@/lib/translations';

export interface NfcProduct3DCanvasProps {
  locale?: Locale;
}

export default function NfcProduct3DCanvas({ locale = 'tr' }: NfcProduct3DCanvasProps) {
  return <Nfc3DCanvas locale={locale} />;
}
export { Nfc3DCanvas };
