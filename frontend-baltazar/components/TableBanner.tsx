'use client';

import { useSearchParams } from 'next/navigation';

interface Props {
  tableId?: string;
  themeColor?: string;
}

export function TableBanner({ tableId: propTableId, themeColor = '#6F4E37' }: Props) {
  const searchParams = useSearchParams();
  const urlTableId = searchParams.get('tableId');
  const tableId = propTableId || urlTableId;

  if (!tableId) return null;

  return (
    <div
      className="w-full py-2 px-4 text-xs font-semibold tracking-wider text-center text-white/90 flex items-center justify-center gap-2 border-b border-white/10 shadow-sm sticky top-0 z-50"
      style={{
        background: `linear-gradient(90deg, ${themeColor}CC 0%, ${themeColor}EE 50%, ${themeColor}CC 100%)`,
        backdropFilter: 'blur(8px)'
      }}
    >
      <span className="text-sm">📍</span>
      <span>Table Context: Masa <strong className="font-extrabold">{tableId}</strong></span>
    </div>
  );
}
