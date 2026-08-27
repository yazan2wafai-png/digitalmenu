'use client';
import { NFCShowcase } from './nfc-showcase';
import type { Locale } from '@/lib/translations';

export interface Nfc3DCanvasProps {
  locale?: Locale;
}

export function Nfc3DCanvas({ locale = 'tr' }: Nfc3DCanvasProps) {
  return <NFCShowcase locale={locale} />;
}

export default Nfc3DCanvas;
