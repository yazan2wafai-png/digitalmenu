'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Mail,
  ArrowRight,
  CheckCircle2,
  Gift,
  ShieldCheck,
  Copy,
} from 'lucide-react';

export function EmailCaptureBespoke() {
  const [email, setEmail] = useState('');
  const [venue, setVenue] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Save lead to localStorage
    const existingLeads = JSON.parse(localStorage.getItem('nfc_leads') || '[]');
    existingLeads.push({ email, venue, date: new Date().toISOString() });
    localStorage.setItem('nfc_leads', JSON.stringify(existingLeads));

    setIsSubmitted(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#a855f7', '#ec4899', '#3b82f6', '#10b981'],
    });
  };

  const copyCode = () => {
    navigator.clipboard.writeText('NFCVIP15');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <div className="relative rounded-3xl bg-gradient-to-tr from-purple-950/60 via-neutral-900/90 to-blue-950/50 border border-purple-500/30 p-8 sm:p-14 backdrop-blur-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)] text-center">
          {/* Subtle Ambient Backlight */}
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-pink-500/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 text-pink-300">
              <Gift className="w-3.5 h-3.5 text-pink-400" />
              VIP Erken Erişim & Numune Fırsatı
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Mekanınıza Özel{' '}
              <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                %15 İndirim Kodunuzu
              </span>{' '}
              Anında Alın.
            </h2>

            <p className="text-sm sm:text-base text-white/70 leading-relaxed">
              E-posta adresinizi bırakın, ilk siparişinizde geçerli özel VIP indirim kodunu anında ekranda görün ve yeni ürün lansmanlarımızdan ilk siz haberdar olun.
            </p>

            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="p-6 rounded-2xl bg-white/10 border border-emerald-500/40 backdrop-blur-md space-y-3"
                >
                  <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-base">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Harika! İndirim Kodunuz Hazır:</span>
                  </div>

                  <div className="flex items-center justify-center gap-3">
                    <div className="px-6 py-3 rounded-xl bg-black/60 border border-purple-500/40 font-mono text-xl font-black text-purple-300 tracking-wider">
                      NFCVIP15
                    </div>
                    <button
                      onClick={copyCode}
                      className="px-4 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
                    >
                      <Copy className="w-4 h-4" />
                      {copied ? 'Kopyalandı!' : 'Kopyala'}
                    </button>
                  </div>

                  <p className="text-xs text-white/50">
                    Sipariş verirken bu kodu kullanarak anında %15 indirimden faydalanabilirsiniz.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      placeholder="İşletme Adınız (Örn: Kahve Erenköy)"
                      value={venue}
                      onChange={(e) => setVenue(e.target.value)}
                      className="sm:w-1/3 px-4 py-3.5 rounded-2xl bg-black/60 border border-white/15 focus:border-purple-500 focus:outline-none text-sm text-white placeholder:text-white/40 shadow-inner"
                    />
                    <input
                      type="email"
                      required
                      placeholder="E-Posta Adresiniz"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 px-4 py-3.5 rounded-2xl bg-black/60 border border-white/15 focus:border-purple-500 focus:outline-none text-sm text-white placeholder:text-white/40 shadow-inner"
                    />
                    <button
                      type="submit"
                      className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-500 hover:via-pink-500 hover:to-blue-500 text-white font-black text-sm tracking-wide shadow-xl shadow-purple-600/30 hover:shadow-purple-600/50 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                    >
                      <span>Kodu Al</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-4 text-[11px] text-white/40 pt-1">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      Spam Gönderilmez
                    </span>
                    <span>•</span>
                    <span>Anında İndirim Tanımlaması</span>
                    <span>•</span>
                    <span>İstediğiniz Zaman İptal</span>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
