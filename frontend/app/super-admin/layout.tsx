import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NFCMyPlace Super Admin',
  description: 'Multi-tenant Platform Administration & Analytics',
};

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased font-sans selection:bg-indigo-500 selection:text-white">
      {children}
    </div>
  );
}
