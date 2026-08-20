'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'nfc_discount_modal_dismissed';

export function DiscountModal() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [venue, setVenue] = useState('');
  const [claimed, setClaimed] = useState(false);
  const [code, setCode] = useState('');

  useEffect(() => {
    // Check if dismissed before
    const isDismissed = localStorage.getItem(STORAGE_KEY);
    if (!isDismissed) {
      const timer = setTimeout(() => {
        setOpen(true);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !venue) return;

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // Fallback if canvas-confetti is not loaded
    }

    setCode('NFC-START-30');
    setClaimed(true);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleDismiss}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative w-full max-w-md bg-neutral-900 border border-amber-500/30 rounded-3xl p-6 shadow-2xl z-10 overflow-hidden text-center"
          >
            {/* Ambient Gold Glow */}
            <div className="absolute -top-16 -right-16 w-32 h-32 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 text-white/70 hover:text-white flex items-center justify-center text-sm transition-colors"
            >
              ✕
            </button>

            {!claimed ? (
              <div>
                <div className="text-4xl mb-3">🎁</div>
                <h3 className="text-2xl font-black text-white leading-tight">
                  Unlock <span className="text-amber-400">30% OFF</span> Your First NFC Order
                </h3>
                <p className="text-xs text-white/60 mt-2 leading-relaxed">
                  Join 500+ restaurants and cafes elevating customer experience with NFCMyPlace smart table hardware.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-3">
                  <input
                    type="text"
                    required
                    placeholder="Venue Name (e.g. Baltazar Cafe)"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Work Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                  />
                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-black text-sm shadow-lg shadow-amber-500/25 transition-all transform active:scale-98"
                  >
                    Claim 30% Off Code
                  </button>
                </form>

                <p className="text-[10px] text-white/30 mt-4">
                  No spam guaranteed. Unsubscribe anytime.
                </p>
              </div>
            ) : (
              <div className="py-4 space-y-4">
                <div className="text-5xl">🎉</div>
                <h3 className="text-2xl font-black text-white">Discount Code Claimed!</h3>
                <p className="text-xs text-white/60">
                  Use code <strong className="text-amber-400 font-mono text-sm">{code}</strong> at checkout or present to your sales manager for 30% off.
                </p>
                <button
                  onClick={handleDismiss}
                  className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors"
                >
                  Continue Browsing
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
