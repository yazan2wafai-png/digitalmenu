'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Zap,
  Star,
  CheckCircle2,
  RotateCcw,
  Radio,
  ChevronDown,
  ExternalLink,
  Loader2,
} from 'lucide-react';

/* ----------------------------------------------------------------
   Venues. Every entry with a `url` loads that real, live menu inside
   the phone frame, so the visitor sees the actual site rather than a
   mockup of it. The Google entry has no URL (Google blocks framing),
   so it keeps a simulated review screen.
   ---------------------------------------------------------------- */

type VenueId = 'baltazar' | 'erenkoy' | 'actnoir' | 'google';

interface Venue {
  id: VenueId;
  label: string;
  sublabel: string;
  accent: string;
  url?: string;
}

const VENUES: Venue[] = [
  {
    id: 'baltazar',
    label: 'Baltazar Burger',
    sublabel: 'Karaköy · Burger',
    accent: '#C9604A',
    url: 'https://baltazar.nfcmyplace.com',
  },
  {
    id: 'erenkoy',
    label: 'Kahve Erenköy',
    sublabel: 'Erenköy · Nitelikli Kahve',
    accent: '#C9A86C',
    url: 'https://kahve-erenkoy.nfcmyplace.com',
  },
  {
    id: 'actnoir',
    label: 'Act Noir Café',
    sublabel: 'Moda · Butik Bakery',
    accent: '#8B9CB0',
    url: 'https://act-noir-cafe.nfcmyplace.com',
  },
  {
    id: 'google',
    label: 'Google Değerlendirme',
    sublabel: 'Tek dokunuşla 5 yıldız',
    accent: '#C9A86C',
  },
];

/* The phone's inner screen is narrower than a real handset, so the live
   site is rendered at true phone width and scaled down. That way the
   venue's own mobile layout renders exactly as it does on a real
   device, instead of a squeezed desktop layout. */
const SCREEN_W = 260;
const SCREEN_H = 430;
const DEVICE_W = 390;
const SCALE = SCREEN_W / DEVICE_W;
const LOAD_TIMEOUT_MS = 8000;

const gold = '#C9A86C';

export function NfcTapSimulator() {
  const [venue, setVenue] = useState<Venue>(VENUES[0]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [tapped, setTapped] = useState(false);
  const [frameReady, setFrameReady] = useState(false);
  const [frameFailed, setFrameFailed] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewDone, setReviewDone] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close the venue dropdown on outside click or Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  // If the live site has not reported back in time, offer the new-tab route.
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (!tapped || !venue.url || frameReady) return;
    timeoutRef.current = setTimeout(() => setFrameFailed(true), LOAD_TIMEOUT_MS);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [tapped, venue, frameReady]);

  const tap = () => {
    setTapped(true);
    setFrameReady(false);
    setFrameFailed(false);
    confetti({
      particleCount: 45,
      spread: 55,
      origin: { y: 0.6 },
      colors: ['#C9A86C', '#E2C99A', '#8A6835', '#F0D99B'],
    });
  };

  const selectVenue = (v: Venue) => {
    setVenue(v);
    setMenuOpen(false);
    setTapped(false);
    setFrameReady(false);
    setFrameFailed(false);
    setReviewDone(false);
  };

  const reset = () => {
    setTapped(false);
    setFrameReady(false);
    setFrameFailed(false);
    setReviewDone(false);
    setRating(5);
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
            style={{
              background: 'rgba(201,168,108,0.08)',
              border: '1px solid rgba(201,168,108,0.25)',
              color: gold,
            }}
          >
            <Radio className="w-3.5 h-3.5 beacon" style={{ color: gold }} />
            Canlı NFC Tap Simülatörü
          </div>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight" style={{ color: '#F0E6D3' }}>
            Karta Dokunun, <span className="gold-text">Telefonunuzda Açılsın.</span>
          </h2>
          <p className="text-base" style={{ color: 'rgba(180,152,104,0.75)' }}>
            Bir mekan seçin, karta dokunun: menü telefonda gerçekte olduğu gibi, canlı sitesinden açılır.
          </p>
        </div>

        {/* Simulator playground */}
        <div
          className="rounded-3xl p-6 sm:p-10 relative overflow-hidden"
          style={{
            background: 'rgba(14,11,6,0.9)',
            border: '1px solid rgba(201,168,108,0.12)',
            backdropFilter: 'blur(24px)',
          }}
        >
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(201,168,108,0.8) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left: venue picker + physical card */}
            <div className="flex flex-col items-center gap-6">
              {/* Venue dropdown */}
              <div ref={menuRef} className="relative w-full max-w-xs">
                <span
                  className="block text-[11px] font-bold uppercase tracking-widest mb-2"
                  style={{ color: 'rgba(180,152,104,0.55)' }}
                >
                  1. Menüyü seçin
                </span>
                <button
                  type="button"
                  onClick={() => setMenuOpen((o) => !o)}
                  aria-haspopup="listbox"
                  aria-expanded={menuOpen}
                  className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl text-left cursor-pointer transition-colors"
                  style={{
                    background: 'rgba(18,14,8,0.9)',
                    border: `1px solid ${menuOpen ? venue.accent + '80' : 'rgba(201,168,108,0.18)'}`,
                  }}
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: venue.accent }}
                    />
                    <span className="min-w-0">
                      <span className="block text-sm font-bold truncate" style={{ color: '#F0E6D3' }}>
                        {venue.label}
                      </span>
                      <span className="block text-[11px] truncate" style={{ color: 'rgba(180,152,104,0.6)' }}>
                        {venue.sublabel}
                      </span>
                    </span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 transition-transform ${menuOpen ? 'rotate-180' : ''}`}
                    style={{ color: 'rgba(201,168,108,0.7)' }}
                  />
                </button>

                <AnimatePresence>
                  {menuOpen && (
                    <motion.ul
                      role="listbox"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.16 }}
                      className="absolute z-30 mt-2 w-full rounded-2xl overflow-hidden p-1.5 space-y-1"
                      style={{
                        background: 'rgba(12,9,5,0.98)',
                        border: '1px solid rgba(201,168,108,0.2)',
                        boxShadow: '0 24px 60px rgba(0,0,0,0.75)',
                      }}
                    >
                      {VENUES.map((v) => {
                        const active = v.id === venue.id;
                        return (
                          <li key={v.id} role="option" aria-selected={active}>
                            <button
                              type="button"
                              onClick={() => selectVenue(v)}
                              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left cursor-pointer transition-colors"
                              style={{
                                background: active ? 'rgba(201,168,108,0.1)' : 'transparent',
                              }}
                            >
                              <span
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{ background: v.accent }}
                              />
                              <span className="min-w-0 flex-1">
                                <span
                                  className="block text-sm font-bold truncate"
                                  style={{ color: active ? '#F0E6D3' : 'rgba(240,230,211,0.75)' }}
                                >
                                  {v.label}
                                </span>
                                <span
                                  className="block text-[11px] truncate"
                                  style={{ color: 'rgba(180,152,104,0.55)' }}
                                >
                                  {v.sublabel}
                                </span>
                              </span>
                              {active && (
                                <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: gold }} />
                              )}
                            </button>
                          </li>
                        );
                      })}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>

              {/* Physical card */}
              <div className="relative flex items-center justify-center pt-2">
                {[1, 2, 3].map((r) => (
                  <motion.div
                    key={r}
                    className="absolute rounded-full pointer-events-none"
                    style={{ width: r * 110, height: r * 110, border: '1px solid rgba(201,168,108,0.15)' }}
                    animate={{ scale: [1, 1.06, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity, delay: r * 0.6, ease: 'easeInOut' }}
                  />
                ))}

                <motion.button
                  type="button"
                  onClick={tap}
                  whileHover={{ scale: 1.03, rotate: -2 }}
                  whileTap={{ scale: 0.97 }}
                  aria-label={`${venue.label} kartına dokun`}
                  className="cursor-pointer relative w-72 h-44 rounded-3xl flex flex-col justify-between p-5 select-none z-10 text-left"
                  style={{
                    background: 'linear-gradient(135deg, #1E170A 0%, #2A1E0A 50%, #1C1508 100%)',
                    border: `1px solid ${venue.accent}66`,
                    boxShadow:
                      '0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(201,168,108,0.08), inset 0 1px 0 rgba(255,220,130,0.08)',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black tracking-widest" style={{ color: gold }}>
                      NFC MYPLACE
                    </span>
                    <Zap className="w-4 h-4" style={{ color: gold }} />
                  </div>
                  <div className="text-center space-y-1">
                    <div className="flex justify-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-4 h-4 fill-[#C9A86C] text-[#C9A86C]" />
                      ))}
                    </div>
                    <span className="text-xs font-bold block" style={{ color: 'rgba(240,230,211,0.9)' }}>
                      {venue.label}
                    </span>
                    <span className="text-[10px] font-medium block" style={{ color: 'rgba(201,168,108,0.5)' }}>
                      2. Karta dokunun
                    </span>
                  </div>
                  <div
                    className="flex justify-between font-mono text-[9px]"
                    style={{ color: 'rgba(201,168,108,0.35)' }}
                  >
                    <span>NTAG213</span>
                    <span>NFC TAP</span>
                  </div>
                </motion.button>
              </div>
            </div>

            {/* Right: phone */}
            <div className="flex justify-center">
              <div
                className="relative rounded-[44px] p-4 flex flex-col"
                style={{
                  width: 300,
                  height: 560,
                  background: '#0A0806',
                  border: '4px solid #2A2018',
                  boxShadow: '0 30px 80px rgba(0,0,0,0.9)',
                }}
              >
                {/* Notch */}
                <div
                  className="w-20 h-5 rounded-full mx-auto mb-2 flex items-center justify-center gap-2"
                  style={{ background: '#1A1510' }}
                >
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#4A9EFF' }} />
                </div>

                {/* Screen */}
                <div
                  className="relative rounded-2xl overflow-hidden mx-auto"
                  style={{ width: SCREEN_W, height: SCREEN_H, background: '#0D0B08' }}
                >
                  {!tapped ? (
                    <div
                      className="absolute inset-0 flex flex-col items-center justify-center text-center gap-4 px-6"
                      style={{ color: 'rgba(180,152,104,0.5)' }}
                    >
                      <motion.div
                        className="w-16 h-16 rounded-full flex items-center justify-center"
                        style={{
                          background: 'rgba(201,168,108,0.08)',
                          border: '1px solid rgba(201,168,108,0.2)',
                        }}
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                      >
                        <Zap className="w-8 h-8" style={{ color: gold }} />
                      </motion.div>
                      <p className="text-xs leading-relaxed">
                        Menüyü seçip karta dokunun, {venue.label} telefonda açılsın.
                      </p>
                    </div>
                  ) : venue.url ? (
                    <>
                      {/* Real, live menu rendered at true phone width and scaled to fit */}
                      <iframe
                        key={venue.url}
                        src={venue.url}
                        title={`${venue.label} canlı menüsü`}
                        onLoad={() => setFrameReady(true)}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        style={{
                          width: DEVICE_W,
                          height: SCREEN_H / SCALE,
                          border: 0,
                          transform: `scale(${SCALE})`,
                          transformOrigin: 'top left',
                        }}
                      />

                      {!frameReady && !frameFailed && (
                        <div
                          className="absolute inset-0 flex flex-col items-center justify-center gap-3"
                          style={{ background: '#0D0B08' }}
                        >
                          <Loader2 className="w-6 h-6 animate-spin" style={{ color: gold }} />
                          <span className="text-[11px]" style={{ color: 'rgba(180,152,104,0.6)' }}>
                            {venue.label} yükleniyor
                          </span>
                        </div>
                      )}

                      {frameFailed && !frameReady && (
                        <div
                          className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center"
                          style={{ background: '#0D0B08' }}
                        >
                          <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(180,152,104,0.7)' }}>
                            Menü bu çerçevede açılamadı. Gerçek cihazda kart okutulduğunda doğrudan açılır.
                          </p>
                          <a
                            href={venue.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold"
                            style={{ background: 'linear-gradient(135deg, #C9A86C, #8A6835)', color: '#0D0B08' }}
                          >
                            <ExternalLink className="w-3.5 h-3.5" /> Menüyü yeni sekmede aç
                          </a>
                        </div>
                      )}
                    </>
                  ) : (
                    /* Google review screen stays simulated: Google does not allow framing */
                    <div className="absolute inset-0 overflow-y-auto p-3">
                      <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full rounded-2xl p-4 space-y-3"
                        style={{ background: 'rgba(30,22,10,0.95)', border: '1px solid rgba(201,168,108,0.2)' }}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-xs text-white">
                            G
                          </div>
                          <div>
                            <span className="text-xs font-bold block" style={{ color: '#F0E6D3' }}>
                              Baltazar Burger Karaköy
                            </span>
                            <span className="text-[10px]" style={{ color: 'rgba(180,152,104,0.6)' }}>
                              Google Haritalar
                            </span>
                          </div>
                        </div>
                        {reviewDone ? (
                          <div className="text-center py-4 space-y-2">
                            <CheckCircle2 className="w-7 h-7 mx-auto" style={{ color: gold }} />
                            <span className="text-xs font-bold block" style={{ color: '#F0E6D3' }}>
                              5 Yıldız Gönderildi
                            </span>
                          </div>
                        ) : (
                          <>
                            <p className="text-xs font-medium" style={{ color: '#D4BC96' }}>
                              Bu mekanı değerlendirin:
                            </p>
                            <div className="flex gap-2 justify-center py-1">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <button
                                  key={s}
                                  type="button"
                                  onClick={() => setRating(s)}
                                  aria-label={`${s} yıldız`}
                                  className="cursor-pointer transition-transform hover:scale-125"
                                >
                                  <Star
                                    className="w-6 h-6"
                                    style={{ color: s <= rating ? gold : '#3A2E18', fill: s <= rating ? gold : 'none' }}
                                  />
                                </button>
                              ))}
                            </div>
                            <button
                              type="button"
                              onClick={() => setReviewDone(true)}
                              className="w-full py-2.5 rounded-xl text-xs font-bold cursor-pointer"
                              style={{ background: 'linear-gradient(135deg, #C9A86C, #8A6835)', color: '#0D0B08' }}
                            >
                              Yorumu Gönder
                            </button>
                          </>
                        )}
                      </motion.div>
                    </div>
                  )}
                </div>

                {/* Footer controls */}
                <div className="mt-2 flex items-center gap-2">
                  {tapped && (
                    <button
                      type="button"
                      onClick={reset}
                      className="flex-1 py-2 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                      style={{
                        background: 'rgba(201,168,108,0.08)',
                        border: '1px solid rgba(201,168,108,0.15)',
                        color: 'rgba(201,168,108,0.6)',
                      }}
                    >
                      <RotateCcw className="w-3 h-3" /> Sıfırla
                    </button>
                  )}
                  {tapped && venue.url && (
                    <a
                      href={venue.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      style={{
                        background: 'rgba(201,168,108,0.08)',
                        border: '1px solid rgba(201,168,108,0.15)',
                        color: 'rgba(201,168,108,0.6)',
                      }}
                    >
                      <ExternalLink className="w-3 h-3" /> Tam ekran
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
