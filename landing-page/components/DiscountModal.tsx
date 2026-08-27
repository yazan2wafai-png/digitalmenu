'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, X, Check, Copy, Gift, ArrowRight } from 'lucide-react';
import type { Locale } from '@/lib/translations';
import { translations } from '@/lib/translations';

const STORAGE_KEY = 'nfc_discount_modal_dismissed';

export interface DiscountModalProps {
  locale?: Locale;
  isOpen?: boolean;
  onClose?: () => void;
}

export function DiscountModal({ locale = 'tr', isOpen, onClose }: DiscountModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [venue, setVenue] = useState('');
  const [claimed, setClaimed] = useState(false);
  const [code, setCode] = useState('');
  const [copied, setCopied] = useState(false);

  const t = translations[locale].modal;

  useEffect(() => {
    const isDismissed = localStorage.getItem(STORAGE_KEY);
    if (!isDismissed) {
      const timer = setTimeout(() => {
        setInternalOpen(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const open = isOpen !== undefined ? isOpen : internalOpen;

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setInternalOpen(false);
    onClose?.();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !venue) return;

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#fbbf24', '#fef08a', '#ffffff'],
      });
    } catch {
      // Fallback
    }

    setCode('NFC30PRO');
    setClaimed(true);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/85 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleDismiss}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 260 }}
            className="relative w-full max-w-md bg-neutral-950 border border-white/15 rounded-3xl p-7 shadow-2xl z-10 overflow-hidden text-center"
          >
            {/* Ambient Radial Mesh Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-amber-500/30 to-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-tr from-amber-600/20 to-transparent rounded-full blur-3xl pointer-events-none" />

            <button
              onClick={handleDismiss}
              aria-label="Close modal"
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white flex items-center justify-center text-sm transition-all cursor-pointer border border-white/10"
            >
              <X className="w-4 h-4" />
            </button>

            {!claimed ? (
              <div className="relative z-10">
                <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-4 shadow-inner">
                  <Gift className="w-8 h-8" />
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight">
                  {t.titleStart}
                  <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
                    {t.titleHighlight}
                  </span>
                  {t.titleEnd}
                </h3>

                <p className="text-xs sm:text-sm text-white/60 mt-2.5 leading-relaxed max-w-xs mx-auto">
                  {t.subtitle}
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-3">
                  <input
                    type="text"
                    required
                    placeholder={t.venuePlaceholder}
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl bg-neutral-900/80 border border-white/10 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                  />
                  <input
                    type="email"
                    required
                    placeholder={t.emailPlaceholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl bg-neutral-900/80 border border-white/10 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                  />
                  <button
                    type="submit"
                    className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-black text-sm shadow-xl shadow-amber-500/25 transition-all transform active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>{t.submitBtn}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            ) : (
              <div className="relative z-10 py-3 space-y-5">
                <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <Sparkles className="w-8 h-8 animate-pulse" />
                </div>
                <h3 className="text-2xl font-black text-white tracking-tight">{t.claimedTitle}</h3>
                <p className="text-xs text-white/60">
                  {t.claimedSub}
                </p>

                {/* Voucher Code Box */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.04] border border-amber-500/40">
                  <span className="font-mono text-xl font-black text-amber-400 tracking-wider">
                    {code}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Kopyalandı' : 'Kopyala'}</span>
                  </button>
                </div>

                <button
                  onClick={handleDismiss}
                  className="w-full py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-colors cursor-pointer border border-white/10"
                >
                  {t.continueBtn}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
