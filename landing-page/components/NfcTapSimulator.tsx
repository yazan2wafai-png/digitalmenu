'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Zap,
  Star,
  Smartphone,
  Radio,
  CheckCircle2,
  RotateCcw,
  ShoppingBag,
  Flame,
  Coffee,
  Sparkles,
} from 'lucide-react';

export type SimulatorScreen = 'google' | 'baltazar' | 'erenkoy' | 'actnoir';

interface NfcTapSimulatorProps {
  initialScreen?: SimulatorScreen;
}

export function NfcTapSimulator({ initialScreen = 'google' }: NfcTapSimulatorProps) {
  const [activeScreen, setActiveScreen] = useState<SimulatorScreen>(initialScreen);
  const [hasTapped, setHasTapped] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const handleTap = (screen?: SimulatorScreen) => {
    if (screen) setActiveScreen(screen);
    setHasTapped(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#a855f7', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'],
    });
  };

  const handleReset = () => {
    setHasTapped(false);
    setReviewSubmitted(false);
    setCartCount(0);
    setRating(5);
  };

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden z-10">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/10 border border-purple-500/20 text-purple-300">
            <Radio className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            Canlı İnteraktif NFC & Menü Deneyimi
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Dokununca Telefonda Ne Açılır?{' '}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Canlıda Test Edin.
            </span>
          </h2>
          <p className="text-base text-white/60">
            Aşağıdaki menülerden birini seçin ve karta tıklayarak telefonun o menüyü nasıl açtığını 0.2 saniyede görün.
          </p>

          {/* Preset Buttons for Real Venues */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
            <button
              onClick={() => {
                setActiveScreen('google');
                setHasTapped(true);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeScreen === 'google'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                  : 'bg-white/5 text-white/60 hover:text-white border border-white/10'
              }`}
            >
              ⭐ Google Değerlendirme
            </button>

            <button
              onClick={() => {
                setActiveScreen('baltazar');
                setHasTapped(true);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeScreen === 'baltazar'
                  ? 'bg-red-500/20 text-red-300 border border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
                  : 'bg-white/5 text-white/60 hover:text-white border border-white/10'
              }`}
            >
              🍔 Baltazar Burger Menüsü
            </button>

            <button
              onClick={() => {
                setActiveScreen('erenkoy');
                setHasTapped(true);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeScreen === 'erenkoy'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.2)]'
                  : 'bg-white/5 text-white/60 hover:text-white border border-white/10'
              }`}
            >
              ☕ Kahve Erenköy Menüsü
            </button>

            <button
              onClick={() => {
                setActiveScreen('actnoir');
                setHasTapped(true);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeScreen === 'actnoir'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.2)]'
                  : 'bg-white/5 text-white/60 hover:text-white border border-white/10'
              }`}
            >
              🥐 Act Noir Café Menüsü
            </button>
          </div>
        </div>

        {/* Interactive Playground Canvas */}
        <div className="relative rounded-3xl bg-neutral-900/60 border border-white/15 p-6 sm:p-10 backdrop-blur-2xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Physical NFC Acrylic Stand / Card */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl bg-neutral-950/80 border border-white/10 relative overflow-hidden">
              {/* Pulsing NFC Aura */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div
                  className="w-48 h-48 rounded-full border border-purple-500/20"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </div>

              {/* Physical Acrylic Card Mockup */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleTap()}
                className="cursor-pointer relative w-72 h-44 rounded-2xl p-5 bg-gradient-to-tr from-neutral-900 via-neutral-800 to-neutral-900 border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col justify-between group select-none"
              >
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
                    {activeScreen === 'google' && 'Google Değerlendirme Kartı'}
                    {activeScreen === 'baltazar' && 'Baltazar Burger Masadan Sipariş'}
                    {activeScreen === 'erenkoy' && 'Kahve Erenköy Akıllı Menü'}
                    {activeScreen === 'actnoir' && 'Act Noir Café Masadan Menü'}
                  </span>
                  <span className="text-[10px] text-purple-300 block">Karta Dokunun (NFC Tap)</span>
                </div>

                <div className="flex items-center justify-between text-[9px] text-white/40">
                  <span>NTAG215 CHIP</span>
                  <span>TEMASSIZ DOKUNUN</span>
                </div>
              </motion.div>

              <p className="text-xs text-purple-300 font-semibold mt-6 flex items-center gap-1.5 animate-bounce">
                <Smartphone className="w-4 h-4" />
                Karta tıklayarak telefondaki açılış tepkisini tetikleyin!
              </p>
            </div>

            {/* Right: Live Interactive Phone Screen Rendering the Real Menu */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="relative w-full max-w-[330px] h-[560px] rounded-[44px] bg-black border-4 border-neutral-800 shadow-[0_25px_60px_rgba(0,0,0,0.9)] p-4 flex flex-col justify-between overflow-hidden">
                {/* iPhone Dynamic Island */}
                <div className="w-24 h-5 bg-neutral-900 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-blue-500/80 mr-2" />
                </div>

                {/* Live Display Area */}
                <div className="flex-1 flex flex-col justify-start items-center text-left p-1 relative overflow-y-auto scrollbar-none w-full">
                  {!hasTapped ? (
                    <div className="my-auto space-y-4 text-center text-white/40">
                      <motion.div
                        className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto"
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Zap className="w-8 h-8 text-purple-400" />
                      </motion.div>
                      <p className="text-xs px-4">
                        Soldaki NFC karta tıklayın veya yukarıdaki menü butonlarına basarak telefon ekranındaki anlık menüyü görün.
                      </p>
                    </div>
                  ) : (
                    <AnimatePresence mode="wait">
                      {/* SCREEN 1: GOOGLE REVIEW */}
                      {activeScreen === 'google' && (
                        <motion.div
                          key="google"
                          initial={{ opacity: 0, scale: 0.9, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="w-full bg-neutral-900 border border-white/15 rounded-2xl p-4 space-y-3 shadow-xl my-auto"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center font-bold text-sm text-white">
                              G
                            </div>
                            <div>
                              <span className="text-xs font-bold text-white block">Baltazar Burger Karaköy</span>
                              <span className="text-[10px] text-white/50">Google Haritalar Profili</span>
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
                                    className="p-1 hover:scale-125 transition-transform cursor-pointer"
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
                                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md cursor-pointer"
                              >
                                Yorumu Gönder
                              </button>
                            </>
                          )}
                        </motion.div>
                      )}

                      {/* SCREEN 2: BALTAZAR BURGER LIVE MENU */}
                      {activeScreen === 'baltazar' && (
                        <motion.div
                          key="baltazar"
                          initial={{ opacity: 0, scale: 0.9, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="w-full space-y-2.5"
                        >
                          {/* Top Restaurant Header */}
                          <div className="p-3 rounded-2xl bg-red-950/40 border border-red-500/20 flex items-center justify-between">
                            <div>
                              <span className="text-xs font-black text-white block">Baltazar Burger</span>
                              <span className="text-[10px] text-red-400">Masa 12 Aktif • TR/EN/AR</span>
                            </div>
                            <span className="text-[10px] bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full font-bold">
                              Karaköy
                            </span>
                          </div>

                          {/* Menu Items */}
                          <div className="space-y-2">
                            <div className="p-2.5 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-between">
                              <div>
                                <span className="font-bold text-xs text-white block">Truffle Smash Burger</span>
                                <span className="text-[10px] text-white/40">Karamelize Soğan, Trüf Mayonez</span>
                                <span className="text-[11px] font-bold text-red-400 block mt-0.5">340 TL</span>
                              </div>
                              <button
                                onClick={() => setCartCount((c) => c + 1)}
                                className="px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-[10px] cursor-pointer"
                              >
                                + Ekle
                              </button>
                            </div>

                            <div className="p-2.5 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-between">
                              <div>
                                <span className="font-bold text-xs text-white block">Cheddar Loaded Fries</span>
                                <span className="text-[10px] text-white/40">Eritilmiş Cheddar, Çıtır Soğan</span>
                                <span className="text-[11px] font-bold text-red-400 block mt-0.5">180 TL</span>
                              </div>
                              <button
                                onClick={() => setCartCount((c) => c + 1)}
                                className="px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-[10px] cursor-pointer"
                              >
                                + Ekle
                              </button>
                            </div>
                          </div>

                          <button
                            onClick={() => alert(`Baltazar Masa 12 için ${cartCount > 0 ? cartCount : 1} adet ürün siparişi iletildi!`)}
                            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Siparişi Ver {cartCount > 0 && `(${cartCount} Ürün)`}</span>
                          </button>
                        </motion.div>
                      )}

                      {/* SCREEN 3: KAHVE ERENKOY LIVE MENU */}
                      {activeScreen === 'erenkoy' && (
                        <motion.div
                          key="erenkoy"
                          initial={{ opacity: 0, scale: 0.9, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="w-full space-y-2.5"
                        >
                          <div className="p-3 rounded-2xl bg-purple-950/40 border border-purple-500/20 flex items-center justify-between">
                            <div>
                              <span className="text-xs font-black text-white block">Kahve Erenköy</span>
                              <span className="text-[10px] text-purple-300">Masa 4 Aktif • Nitelikli Kahve</span>
                            </div>
                            <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-bold">
                              Erenköy
                            </span>
                          </div>

                          <div className="space-y-2">
                            <div className="p-2.5 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-between">
                              <div>
                                <span className="font-bold text-xs text-white block">V60 Ethiopia Yirgacheffe</span>
                                <span className="text-[10px] text-white/40">Çiçeksi, Narenciye, Bergamot</span>
                                <span className="text-[11px] font-bold text-purple-400 block mt-0.5">170 TL</span>
                              </div>
                              <button
                                onClick={() => setCartCount((c) => c + 1)}
                                className="px-2.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-[10px] cursor-pointer"
                              >
                                + Ekle
                              </button>
                            </div>

                            <div className="p-2.5 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-between">
                              <div>
                                <span className="font-bold text-xs text-white block">San Sebastian Cheesecake</span>
                                <span className="text-[10px] text-white/40">Karamelize Kabuk, Akışkan Doku</span>
                                <span className="text-[11px] font-bold text-purple-400 block mt-0.5">160 TL</span>
                              </div>
                              <button
                                onClick={() => setCartCount((c) => c + 1)}
                                className="px-2.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-[10px] cursor-pointer"
                              >
                                + Ekle
                              </button>
                            </div>
                          </div>

                          <button
                            onClick={() => alert(`Kahve Erenköy Masa 4 için sipariş iletildi!`)}
                            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Siparişi Onayla {cartCount > 0 && `(${cartCount} Ürün)`}</span>
                          </button>
                        </motion.div>
                      )}

                      {/* SCREEN 4: ACT NOIR LIVE MENU */}
                      {activeScreen === 'actnoir' && (
                        <motion.div
                          key="actnoir"
                          initial={{ opacity: 0, scale: 0.9, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="w-full space-y-2.5"
                        >
                          <div className="p-3 rounded-2xl bg-blue-950/40 border border-blue-500/20 flex items-center justify-between">
                            <div>
                              <span className="text-xs font-black text-white block">Act Noir Café</span>
                              <span className="text-[10px] text-blue-300">Moda • Butik Bakery</span>
                            </div>
                            <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-bold">
                              Moda
                            </span>
                          </div>

                          <div className="space-y-2">
                            <div className="p-2.5 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-between">
                              <div>
                                <span className="font-bold text-xs text-white block">Flat White (Double Shot)</span>
                                <span className="text-[10px] text-white/40">Kadifemsi Mikro Köpük</span>
                                <span className="text-[11px] font-bold text-blue-400 block mt-0.5">140 TL</span>
                              </div>
                              <button
                                onClick={() => setCartCount((c) => c + 1)}
                                className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] cursor-pointer"
                              >
                                + Ekle
                              </button>
                            </div>

                            <div className="p-2.5 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-between">
                              <div>
                                <span className="font-bold text-xs text-white block">Bademli Kruvasan</span>
                                <span className="text-[10px] text-white/40">Fransız Tereyağlı, Günlük Taze</span>
                                <span className="text-[11px] font-bold text-blue-400 block mt-0.5">110 TL</span>
                              </div>
                              <button
                                onClick={() => setCartCount((c) => c + 1)}
                                className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] cursor-pointer"
                              >
                                + Ekle
                              </button>
                            </div>
                          </div>

                          <button
                            onClick={() => alert(`Act Noir için sipariş iletildi!`)}
                            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Siparişi Ver {cartCount > 0 && `(${cartCount} Ürün)`}</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>

                {/* Bottom Reset Button */}
                {hasTapped && (
                  <button
                    onClick={handleReset}
                    className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Simülatörü Sıfırla
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
