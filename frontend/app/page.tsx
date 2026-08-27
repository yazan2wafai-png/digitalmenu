import Link from 'next/link';

export default function RootPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Background Decorative Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
      </div>

      {/* Navigation Bar */}
      <header className="relative z-10 border-b border-white/10 backdrop-blur-md bg-neutral-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-lg font-black shadow-md shadow-indigo-500/20">
              ⚡
            </div>
            <span className="text-lg font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              NFCMyPlace
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/login"
              className="px-3.5 py-1.5 text-xs font-semibold text-neutral-300 hover:text-white transition rounded-lg hover:bg-neutral-900 border border-transparent hover:border-neutral-800"
            >
              Restaurant Admin
            </Link>
            <Link
              href="/super-admin/login"
              className="px-3.5 py-1.5 text-xs font-semibold bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 border border-indigo-500/30 rounded-lg transition"
            >
              Super Admin →
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-12 sm:py-20 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-neutral-300 mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Multi-Tenant Contactless Digital Menu Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight max-w-3xl leading-tight">
          Next-Gen Contactless Smart{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
            NFC & QR Menus
          </span>
        </h1>

        <p className="text-sm sm:text-base text-neutral-400 max-w-2xl mt-4 leading-relaxed">
          Dynamic multi-tenant table ordering platform with real-time analytics, instant multi-language translation, and granular RBAC controls.
        </p>

        {/* Live Tenant Demonstrations */}
        <section className="w-full max-w-4xl mt-14">
          <div className="text-left mb-6">
            <h2 className="text-xl font-bold tracking-tight text-white">Live Restaurant Menus</h2>
            <p className="text-xs text-neutral-400">Explore demo tenant menus running on isolated subdomains</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Baltazar Burger */}
            <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 text-left relative overflow-hidden group hover:border-red-500/40 transition">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-xl">
                    🍔
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">Baltazar Burger</h3>
                    <span className="text-[11px] font-mono text-red-400">baltazar.nfcmyplace.com</span>
                  </div>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 font-medium">
                  Artisan Burgers
                </span>
              </div>
              <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
                Handcrafted gourmet burgers, steaks & signature shakes with dark-mode 3D menu animations and table ordering.
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
                <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                  <span>🌐 TR / EN / AR</span>
                </div>
                <Link
                  href="/baltazar"
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-xl transition shadow-lg shadow-red-600/20 flex items-center gap-1.5"
                >
                  <span>Open Menu</span>
                  <span>↗</span>
                </Link>
              </div>
            </div>

            {/* Kahve Erenköy */}
            <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 text-left relative overflow-hidden group hover:border-amber-500/40 transition">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-xl">
                    ☕
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">Kahve Erenköy</h3>
                    <span className="text-[11px] font-mono text-amber-400">kahve-erenkoy.nfcmyplace.com</span>
                  </div>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
                  Specialty Coffee
                </span>
              </div>
              <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
                Single-origin pour-overs, specialty espresso, artisan bakery, and allergen & bean roast profiles.
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
                <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                  <span>🌐 TR / EN / AR</span>
                </div>
                <Link
                  href="/kahve-erenkoy"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-xl transition shadow-lg shadow-amber-600/20 flex items-center gap-1.5"
                >
                  <span>Open Menu</span>
                  <span>↗</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Platform Architecture & Highlights */}
        <section className="w-full max-w-4xl mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          <div className="p-5 rounded-2xl bg-neutral-900/50 border border-neutral-800/80">
            <div className="text-xl mb-2">⚡</div>
            <h4 className="font-bold text-sm text-white mb-1">Instant NFC & Dynamic QR</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Touch-to-open smart NFC cards and table-specific QR codes with live session tracking.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-neutral-900/50 border border-neutral-800/80">
            <div className="text-xl mb-2">🏢</div>
            <h4 className="font-bold text-sm text-white mb-1">Subdomain Multi-Tenancy</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Every restaurant runs under its own branded subdomain with custom themes and catalog isolation.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-neutral-900/50 border border-neutral-800/80">
            <div className="text-xl mb-2">🛡️</div>
            <h4 className="font-bold text-sm text-white mb-1">SuperAdmin & RBAC</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Global tenant provisioning, real-time analytics, and granular restaurant feature toggles.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-6 text-center text-xs text-neutral-500">
        <p>© {new Date().getFullYear()} NFCMyPlace. Multi-Tenant Digital Menu Ecosystem.</p>
      </footer>
    </div>
  );
}
