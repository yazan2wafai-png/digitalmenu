import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Digital Menu Admin Portal',
  description: 'Digital Menu Restaurant Management Portal',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 antialiased font-sans">
      {children}
    </div>
  );
}
