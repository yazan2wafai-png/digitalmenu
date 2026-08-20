'use client';

interface Props {
  tableId?: string;
  themeColor?: string;
}

export function TableBanner({ tableId, themeColor = '#6F4E37' }: Props) {
  if (!tableId) return null;

  return (
    <div
      className="w-full py-2 px-4 text-xs font-semibold tracking-wider text-center text-white/90 flex items-center justify-center gap-2 border-b border-white/10 shadow-sm"
      style={{
        background: `linear-gradient(90deg, ${themeColor}CC 0%, ${themeColor}EE 50%, ${themeColor}CC 100%)`,
      }}
    >
      <span className="text-sm">📍</span>
      <span>Dine-In Table: <strong className="font-extrabold underline">{tableId}</strong></span>
    </div>
  );
}
