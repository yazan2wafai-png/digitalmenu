'use client';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import HomePage from '../../page';

export default function TablePage() {
  const params = useParams();

  useEffect(() => {
    if (params?.tableId) {
      sessionStorage.setItem('tableId', params.tableId as string);
    }
  }, [params]);

  return <HomePage />;
}
