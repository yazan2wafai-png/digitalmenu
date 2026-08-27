'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

interface Props {
  slug: string;
  tableId?: string;
  themeColor?: string;
}

export function TableBanner({ slug, tableId: propTableId, themeColor = '#6F4E37' }: Props) {
  const searchParams = useSearchParams();
  const urlTableId = searchParams.get('tableId');
  const tableId = propTableId || urlTableId;

  // Resolve the friendly table name (e.g. "Masa 4") instead of ever showing
  // the raw database id to the customer.
  const [tableName, setTableName] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setTableName(null);
    if (!slug || !tableId) return;

    fetch(`/api/proxy/restaurants/${slug}/tables/${tableId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data?.name) setTableName(data.name);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [slug, tableId]);

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
      <span>
        Masa: <strong className="font-extrabold">{tableName || '…'}</strong>
      </span>
    </div>
  );
}
