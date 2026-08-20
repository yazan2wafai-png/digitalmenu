'use client';

import { useEffect } from 'react';
import { recordPageView } from '@/lib/api';

interface MenuTrackerProps {
  slug: string;
  tableId?: string;
}

export default function MenuTracker({ slug, tableId }: MenuTrackerProps) {
  useEffect(() => {
    const key = `nfc_view_${slug}_${tableId || 'root'}`;
    const lastViewedStr = sessionStorage.getItem(key);
    
    let shouldRecord = true;
    
    if (lastViewedStr) {
      const lastViewed = parseInt(lastViewedStr, 10);
      const THIRTY_MINUTES = 30 * 60 * 1000;
      
      if (!isNaN(lastViewed) && Date.now() - lastViewed < THIRTY_MINUTES) {
        shouldRecord = false;
      }
    }

    if (shouldRecord) {
      sessionStorage.setItem(key, Date.now().toString());
      recordPageView(slug, tableId);
    }
  }, [slug, tableId]);

  return null;
}
