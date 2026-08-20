'use client';
import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-40 bg-neutral-950/80 backdrop-blur-md border-b border-white/10 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center font-black text-black text-xs shadow-md">
            NFC
          </div>
          <span className="font-extrabold text-lg text-white tracking-tight">
            NFC<span className="text-amber-400">MyPlace</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-white/70">
          <a href="#hardware" className="hover:text-white transition-colors">3D Hardware</a>
          <a href="#demos" className="hover:text-white transition-colors">Live Demos</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="#features" className="hover:text-white transition-colors">Features</a>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <a
            href="https://digitalmenu-admin-panel.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-white/60 hover:text-white transition-colors"
          >
            Admin Login
          </a>
          <a
            href="#pricing"
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs shadow-lg shadow-amber-500/20 transition-all"
          >
            Order Starter Kit
          </a>
        </div>
      </div>
    </nav>
  );
}
