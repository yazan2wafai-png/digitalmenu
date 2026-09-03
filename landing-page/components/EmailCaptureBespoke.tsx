'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
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
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden z-10">
      <div className="max-w-4xl mx-auto">
        <div className="relative rounded-3xl bg-[#12141F] border border-neutral-700 p-8 sm:p-14 overflow-hidden shadow-2xl text-center">
          <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-pink-500/20 border border-pink-500/40 text-pink-300">
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

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
              E-posta adresinizi bırakın, ilk siparişinizde geçerli özel VIP indirim kodunu anında ekranda görün ve yeni ürün lansmanlarımızdan ilk siz haberdar olun.
            </p>

            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="p-6 rounded-2xl bg-[#1A1C29] border border-emerald-500/50 space-y-3"
                >
                  <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-base">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Harika! İndirim Kodunuz Hazır:</span>
                  </div>

                  <div className="flex items-center justify-center gap-3">
                    <div className="px-6 py-3 rounded-xl bg-black border border-purple-500/60 font-mono text-xl font-black text-purple-300 tracking-wider">
                      NFCVIP15
                    </div>
                    <button
                      onClick={copyCode}
                      className="px-4 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Copy className="w-4 h-4" />
                      {copied ? 'Kopyalandı!' : 'Kopyala'}
                    </button>
                  </div>

                  <p className="text-xs text-slate-300">
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
                      className="sm:w-1/3 px-4 py-3.5 rounded-2xl bg-neutral-900 border border-neutral-700 focus:border-purple-500 focus:outline-none text-sm text-white placeholder:text-neutral-400 shadow-inner"
                    />
                    <input
                      type="email"
                      required
                      placeholder="E-Posta Adresiniz"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 px-4 py-3.5 rounded-2xl bg-neutral-900 border border-neutral-700 focus:border-purple-500 focus:outline-none text-sm text-white placeholder:text-neutral-400 shadow-inner"
                    />
                    <button
                      type="submit"
                      className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-500 hover:via-pink-500 hover:to-blue-500 text-white font-black text-sm tracking-wide shadow-xl shadow-purple-600/30 hover:shadow-purple-600/50 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                    >
                      <span>Kodu Al</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-4 text-xs text-slate-300 pt-2 font-medium">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <ShieldCheck className="w-4 h-4" />
                      Spam Gönderilmez
                    </span>
                    <span>•</span>
                    <span>Anında İndirim</span>
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
