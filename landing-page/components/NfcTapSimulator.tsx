'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Zap,
  Star,
  Smartphone,
  Radio,
  ArrowRight,
  CheckCircle2,
  ThumbsUp,
  RotateCcw,
} from 'lucide-react';

export function NfcTapSimulator() {
  const [activeMode, setActiveMode] = useState<'google' | 'menu'>('google');
  const [hasTapped, setHasTapped] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const handleTap = () => {
    setHasTapped(true);
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
      colors: activeMode === 'google' ? ['#f59e0b', '#ef4444', '#3b82f6', '#10b981'] : ['#a855f7', '#ec4899', '#3b82f6'],
    });
  };

  const handleReset = () => {
    setHasTapped(false);
    setReviewSubmitted(false);
    setRating(5);
  };

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 text-purple-300">
            <Radio className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            Canlı İnteraktif Simülatör
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Telefonunuzu Yaklaştırın.{' '}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Sihir 0.2 Saniyede Başlasın.
            </span>
          </h2>
          <p className="text-base text-white/60">
            Müşterilerinizin mekanınızda yaşayacağı sıfır sürtünmeli NFC deneyimini aşağıdaki simülatörde canlı deneyin.
          </p>

          {/* Mode Switcher Buttons */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setActiveMode('google');
                handleReset();
              }}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeMode === 'google'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                  : 'bg-white/5 text-white/60 hover:text-white border border-white/10'
              }`}
            >
              ⭐ Google 5 Yıldız Değerlendirme Modu
            </button>
            <button
              onClick={() => {
                setActiveMode('menu');
                handleReset();
              }}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeMode === 'menu'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.2)]'
                  : 'bg-white/5 text-white/60 hover:text-white border border-white/10'
              }`}
            >
              🍽️ Akıllı Masadan Sipariş Modu
            </button>
          </div>
        </div>

        {/* Interactive Playground Canvas */}
        <div className="relative rounded-3xl bg-gradient-to-b from-white/[0.06] to-black/60 border border-white/15 p-6 sm:p-10 backdrop-blur-2xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Interactive NFC Card / Stand Touch Target */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl bg-neutral-950/60 border border-white/10 relative overflow-hidden">
              {/* Pulsing Concentric Aura */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div
                  className="w-48 h-48 rounded-full border border-purple-500/20"
                  animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </div>

              {/* Physical Acrylic Card Mockup */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleTap}
                className="cursor-pointer relative w-72 h-44 rounded-2xl p-5 bg-gradient-to-tr from-neutral-900 via-neutral-800 to-neutral-900 border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col justify-between group select-none"
              >
                {/* Holographic Sheen */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />

                <div className="flex items-center justify-between">
                  <span className="text-xs font-black tracking-wider text-white">NFC MY PLACE</span>
                  <Zap className="w-5 h-5 text-amber-400 animate-pulse" />
                </div>

                <div className="text-center my-auto space-y-1">
                  <div className="flex justify-center gap-1 text-amber-400 mb-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-white block">
                    {activeMode === 'google' ? 'Google Değerlendirme' : 'Kahve Erenköy Menü'}
                  </span>
                  <span className="text-[10px] text-white/50 block">Dokun ve Keşfet (NFC)</span>
                </div>

                <div className="flex items-center justify-between text-[9px] text-white/40">
                  <span>NTAG215 CHIP</span>
                  <span>TEMASSIZ DOKUNUN</span>
                </div>
              </motion.div>

              <p className="text-xs text-purple-300 font-semibold mt-6 flex items-center gap-1.5 animate-bounce">
                <Smartphone className="w-4 h-4" />
                Kartın üstüne tıklayarak telefon dokunuşunu simüle edin!
              </p>
            </div>

            {/* Right: Simulated Mobile Phone Screen Result */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="relative w-full max-w-[320px] h-[520px] rounded-[40px] bg-black border-4 border-neutral-800 shadow-[0_25px_60px_rgba(0,0,0,0.9)] p-4 flex flex-col justify-between overflow-hidden">
                {/* iPhone Dynamic Island Mockup */}
                <div className="w-24 h-5 bg-neutral-900 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-blue-500/80 mr-2" />
                </div>

                {/* Phone Display Area */}
                <div className="flex-1 flex flex-col justify-center items-center text-center p-3 relative">
                  {!hasTapped ? (
                    <div className="space-y-4 text-white/40">
                      <motion.div
                        className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto"
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Zap className="w-8 h-8 text-purple-400" />
                      </motion.div>
                      <p className="text-xs">Sol taraftaki NFC karta tıklayarak telefona gelen anlık bildirimi görün.</p>
                    </div>
                  ) : activeMode === 'google' ? (
                    /* Google Review Interactive Modal on Phone */
                    <motion.div
                      initial={{ opacity: 0, scale: 0.85, y: 30 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      className="w-full bg-neutral-900 border border-white/15 rounded-2xl p-4 text-left space-y-3 shadow-xl"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-xs text-white">
                          G
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white block">Baltazar Burger</span>
                          <span className="text-[10px] text-white/50">Google İşletme Profili</span>
                        </div>
                      </div>

                      {reviewSubmitted ? (
                        <div className="text-center py-4 space-y-2">
                          <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                          <span className="text-xs font-bold text-white block">5 Yıldızlı Yorumunuz İletildi!</span>
                          <p className="text-[10px] text-white/60">İşletmeye desteğiniz için teşekkürler.</p>
                        </div>
                      ) : (
                        <>
                          <p className="text-xs text-white/80 font-medium">Bu mekanı değerlendirin:</p>
                          <div className="flex gap-1.5 justify-center py-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className="p-1 hover:scale-125 transition-transform"
                              >
                                <Star
                                  className={`w-6 h-6 ${
                                    star <= rating
                                      ? 'text-amber-400 fill-amber-400'
                                      : 'text-neutral-600'
                                  }`}
                                />
                              </button>
                            ))}
                          </div>

                          <button
                            onClick={() => setReviewSubmitted(true)}
                            className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md"
                          >
                            Yorumu Gönder
                          </button>
                        </>
                      )}
                    </motion.div>
                  ) : (
                    /* Digital Menu Table Ordering on Phone */
                    <motion.div
                      initial={{ opacity: 0, scale: 0.85, y: 30 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      className="w-full bg-neutral-900 border border-white/15 rounded-2xl p-4 text-left space-y-3 shadow-xl"
                    >
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <div>
                          <span className="text-xs font-bold text-white block">Kahve Erenköy</span>
                          <span className="text-[10px] text-emerald-400">Masa 4 Aktif</span>
                        </div>
                        <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-semibold">
                          Canlı Menü
                        </span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="p-2 rounded-xl bg-white/5 flex items-center justify-between">
                          <div>
                            <span className="font-bold text-white block">Limon Ristretto</span>
                            <span className="text-[10px] text-white/40">220 TL</span>
                          </div>
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md font-bold">
                            + Sepete Ekle
                          </span>
                        </div>

                        <div className="p-2 rounded-xl bg-white/5 flex items-center justify-between">
                          <div>
                            <span className="font-bold text-white block">San Sebastian</span>
                            <span className="text-[10px] text-white/40">160 TL</span>
                          </div>
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md font-bold">
                            + Sepete Ekle
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => alert('Sipariş masadan garsona iletildi!')}
                        className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md"
                      >
                        Siparişi Ver & Garson Çağır
                      </button>
                    </motion.div>
                  )}
                </div>

                {/* Bottom Reset Button */}
                {hasTapped && (
                  <button
                    onClick={handleReset}
                    className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Tekrar Dene
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
