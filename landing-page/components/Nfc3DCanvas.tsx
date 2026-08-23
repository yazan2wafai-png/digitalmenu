'use client';
import { NFCShowcase } from './nfc-showcase';
import type { Locale } from '@/lib/translations';

interface Props {
  locale?: Locale;
}

export function Nfc3DCanvas({ locale = 'tr' }: Props) {
  return <NFCShowcase locale={locale} />;
}

export default Nfc3DCanvas;
