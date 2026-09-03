'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Zap, Star, CheckCircle2, RotateCcw, ShoppingBag, Radio } from 'lucide-react';

type Screen = 'google' | 'baltazar' | 'erenkoy' | 'actnoir';

export function NfcTapSimulator() {
  const [screen, setScreen] = useState<Screen>('google');
  const [tapped, setTapped] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewDone, setReviewDone] = useState(false);
  const [cart, setCart] = useState(0);

  const tap = (s: Screen) => {
    setScreen(s); setTapped(true);
    confetti({ particleCount: 45, spread: 55, origin: { y: 0.6 }, colors: ['#C9A86C','#E2C99A','#8A6835','#F0D99B'] });
  };

  const reset = () => { setTapped(false); setReviewDone(false); setCart(0); setRating(5); };

  const gold = '#C9A86C';

  const TABS: { id: Screen; label: string; icon: string; accentColor: string }[] = [
    { id: 'google', label: 'Google Yorum', icon: '⭐', accentColor: '#C9A86C' },
    { id: 'baltazar', label: 'Baltazar Burger', icon: '🍔', accentColor: '#C9604A' },
    { id: 'erenkoy', label: 'Kahve Erenköy', icon: '☕', accentColor: '#C9A86C' },
    { id: 'actnoir', label: 'Act Noir Café', icon: '🥐', accentColor: '#8B9CB0' },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
            style={{ background: 'rgba(201,168,108,0.08)', border: '1px solid rgba(201,168,108,0.25)', color: gold }}>
            <Radio className="w-3.5 h-3.5 beacon" style={{ color: gold }} />
            Canlı NFC Tap Simülatörü
          </div>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight" style={{ color: '#F0E6D3' }}>
            Karta Dokunun,{' '}
            <span className="gold-text">Telefonunuzda Görün.</span>
          </h2>
          <p className="text-base" style={{ color: 'rgba(180,152,104,0.75)' }}>
            Hangi menünün telefonda nasıl açıldığını anında test edin.
          </p>

          {/* Mode selector tabs */}
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {TABS.map(tab => (
              <button key={tab.id}
                onClick={() => tap(tab.id)}
                className="px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                style={{
                  background: screen === tab.id && tapped ? `rgba(${tab.accentColor === '#C9A86C' ? '201,168,108' : tab.accentColor === '#C9604A' ? '201,96,74' : '139,156,176'},0.15)` : 'rgba(18,14,8,0.8)',
                  border: `1px solid ${screen === tab.id && tapped ? tab.accentColor + '60' : 'rgba(201,168,108,0.1)'}`,
                  color: screen === tab.id && tapped ? tab.accentColor : 'rgba(180,152,104,0.6)',
                }}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Simulator playground */}
        <div className="rounded-3xl p-6 sm:p-10 relative overflow-hidden"
          style={{ background: 'rgba(14,11,6,0.9)', border: '1px solid rgba(201,168,108,0.12)', backdropFilter: 'blur(24px)' }}>
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: 'radial-gradient(circle, rgba(201,168,108,0.8) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left: physical card */}
            <div className="flex flex-col items-center gap-6">
              <div className="relative flex items-center justify-center">
                {/* NFC rings */}
                {[1,2,3].map(r => (
                  <motion.div key={r} className="absolute rounded-full pointer-events-none"
                    style={{ width: r * 110, height: r * 110, border: '1px solid rgba(201,168,108,0.15)' }}
                    animate={{ scale: [1, 1.06, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity, delay: r * 0.6, ease: 'easeInOut' }} />
                ))}

                {/* Physical acrylic card */}
                <motion.div whileHover={{ scale: 1.03, rotate: -2 }} whileTap={{ scale: 0.97 }}
                  onClick={() => tap(screen)}
                  className="cursor-pointer relative w-72 h-44 rounded-3xl flex flex-col justify-between p-5 select-none z-10"
                  style={{
                    background: 'linear-gradient(135deg, #1E170A 0%, #2A1E0A 50%, #1C1508 100%)',
                    border: '1px solid rgba(201,168,108,0.4)',
                    boxShadow: '0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(201,168,108,0.08), inset 0 1px 0 rgba(255,220,130,0.08)',
                  }}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black tracking-widest" style={{ color: gold }}>NFC MYPLACE</span>
                    <Zap className="w-4 h-4" style={{ color: gold }} />
                  </div>
                  <div className="text-center space-y-1">
                    <div className="flex justify-center gap-0.5">
                      {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-[#C9A86C] text-[#C9A86C]" />)}
                    </div>
                    <span className="text-xs font-bold block" style={{ color: 'rgba(240,230,211,0.9)' }}>
                      {screen === 'google' && 'Google Değerlendirme Kartı'}
                      {screen === 'baltazar' && 'Baltazar Burger'}
                      {screen === 'erenkoy' && 'Kahve Erenköy Menü'}
                      {screen === 'actnoir' && 'Act Noir Café Menü'}
                    </span>
                    <span className="text-[10px] font-medium block" style={{ color: 'rgba(201,168,108,0.5)' }}>Karta Dokunun</span>
                  </div>
                  <div className="flex justify-between font-mono text-[9px]" style={{ color: 'rgba(201,168,108,0.35)' }}>
                    <span>NTAG213</span><span>NFC TAP</span>
                  </div>
                </motion.div>
              </div>

              <p className="text-xs font-semibold flex items-center gap-1.5" style={{ color: 'rgba(201,168,108,0.6)' }}>
                <span>↑ Karta tıklayın veya üstteki menülerden seçin</span>
              </p>
            </div>

            {/* Right: phone screen */}
            <div className="flex justify-center">
              <div className="relative w-[300px] h-[560px] rounded-[44px] p-4 flex flex-col"
                style={{ background: '#0A0806', border: '4px solid #2A2018', boxShadow: '0 30px 80px rgba(0,0,0,0.9)' }}>
                {/* Status bar */}
                <div className="w-20 h-5 rounded-full mx-auto mb-2 flex items-center justify-center gap-2"
                  style={{ background: '#1A1510' }}>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#4A9EFF' }} />
                </div>

                {/* Screen content */}
                <div className="flex-1 overflow-y-auto scrollbar-none flex flex-col items-center">
                  {!tapped ? (
                    <div className="m-auto text-center space-y-4" style={{ color: 'rgba(180,152,104,0.5)' }}>
                      <motion.div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center"
                        style={{ background: 'rgba(201,168,108,0.08)', border: '1px solid rgba(201,168,108,0.2)' }}
                        animate={{ y: [0, -8, 0] }} transition={{ duration: 2.5, repeat: Infinity }}>
                        <Zap className="w-8 h-8" style={{ color: gold }} />
                      </motion.div>
                      <p className="text-xs px-6 leading-relaxed">Soldaki karta tıklayın veya yukarıdan bir menü seçin.</p>
                    </div>
                  ) : (
                    <AnimatePresence mode="wait">
                      {screen === 'google' && (
                        <motion.div key="g" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          className="w-full rounded-2xl p-4 space-y-3 mt-2"
                          style={{ background: 'rgba(30,22,10,0.95)', border: '1px solid rgba(201,168,108,0.2)' }}>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-xs text-white">G</div>
                            <div>
                              <span className="text-xs font-bold block" style={{ color: '#F0E6D3' }}>Baltazar Burger Karaköy</span>
                              <span className="text-[10px]" style={{ color: 'rgba(180,152,104,0.6)' }}>Google Haritalar</span>
                            </div>
                          </div>
                          {reviewDone ? (
                            <div className="text-center py-4 space-y-2">
                              <CheckCircle2 className="w-7 h-7 mx-auto" style={{ color: gold }} />
                              <span className="text-xs font-bold block" style={{ color: '#F0E6D3' }}>5 Yıldız Gönderildi!</span>
                            </div>
                          ) : (
                            <>
                              <p className="text-xs font-medium" style={{ color: '#D4BC96' }}>Bu mekanı değerlendirin:</p>
                              <div className="flex gap-2 justify-center py-1">
                                {[1,2,3,4,5].map(s => (
                                  <button key={s} onClick={() => setRating(s)} className="cursor-pointer transition-transform hover:scale-125">
                                    <Star className="w-6 h-6" style={{ color: s <= rating ? gold : '#3A2E18', fill: s <= rating ? gold : 'none' }} />
                                  </button>
                                ))}
                              </div>
                              <button onClick={() => setReviewDone(true)}
                                className="w-full py-2.5 rounded-xl text-xs font-bold cursor-pointer"
                                style={{ background: 'linear-gradient(135deg, #C9A86C, #8A6835)', color: '#0D0B08' }}>
                                Yorumu Gönder
                              </button>
                            </>
                          )}
                        </motion.div>
                      )}

                      {screen === 'baltazar' && (
                        <motion.div key="b" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          className="w-full space-y-2 mt-2">
                          <div className="p-3 rounded-xl flex items-center justify-between"
                            style={{ background: 'rgba(30,12,8,0.95)', border: '1px solid rgba(201,96,74,0.3)' }}>
                            <div>
                              <span className="text-xs font-black block" style={{ color: '#F0E6D3' }}>Baltazar Burger</span>
                              <span className="text-[10px]" style={{ color: '#C9604A' }}>Masa 12 • Karaköy</span>
                            </div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(201,96,74,0.2)', color: '#C9604A' }}>Aktif</span>
                          </div>
                          {[{n:'Truffle Smash Burger',d:'Karamelize Soğan, Trüf',p:'340 TL'},{n:'Cheddar Loaded Fries',d:'Eritilmiş Cheddar',p:'180 TL'}].map(item => (
                            <div key={item.n} className="p-2.5 rounded-xl flex items-center justify-between"
                              style={{ background: 'rgba(20,14,8,0.9)', border: '1px solid rgba(201,168,108,0.1)' }}>
                              <div>
                                <span className="text-xs font-bold block" style={{ color: '#F0E6D3' }}>{item.n}</span>
                                <span className="text-[10px]" style={{ color: 'rgba(180,152,104,0.6)' }}>{item.d}</span>
                                <span className="text-[11px] font-bold block mt-0.5" style={{ color: '#C9A86C' }}>{item.p}</span>
                              </div>
                              <button onClick={() => setCart(c => c + 1)}
                                className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer"
                                style={{ background: 'linear-gradient(135deg, #C9604A, #8A3020)', color: 'white' }}>
                                + Ekle
                              </button>
                            </div>
                          ))}
                          <button onClick={() => alert(`Masa 12 için sipariş iletildi! (${cart} ürün)`)}
                            className="w-full py-2.5 rounded-xl text-xs font-bold cursor-pointer flex items-center justify-center gap-1.5"
                            style={{ background: 'linear-gradient(135deg, #C9604A, #8A3020)', color: 'white' }}>
                            <ShoppingBag className="w-3.5 h-3.5" /> Siparişi Ver {cart > 0 && `(${cart})`}
                          </button>
                        </motion.div>
                      )}

                      {screen === 'erenkoy' && (
                        <motion.div key="e" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          className="w-full space-y-2 mt-2">
                          <div className="p-3 rounded-xl flex items-center justify-between"
                            style={{ background: 'rgba(20,16,8,0.95)', border: '1px solid rgba(201,168,108,0.3)' }}>
                            <div>
                              <span className="text-xs font-black block" style={{ color: '#F0E6D3' }}>Kahve Erenköy</span>
                              <span className="text-[10px]" style={{ color: gold }}>Masa 4 • Nitelikli Kahve</span>
                            </div>
                          </div>
                          {[{n:'V60 Ethiopia Yirgacheffe',d:'Çiçeksi, Narenciye',p:'170 TL'},{n:'San Sebastian Cheesecake',d:'Karamelize Kabuk',p:'160 TL'}].map(item => (
                            <div key={item.n} className="p-2.5 rounded-xl flex items-center justify-between"
                              style={{ background: 'rgba(20,14,8,0.9)', border: '1px solid rgba(201,168,108,0.1)' }}>
                              <div>
                                <span className="text-xs font-bold block" style={{ color: '#F0E6D3' }}>{item.n}</span>
                                <span className="text-[10px]" style={{ color: 'rgba(180,152,104,0.6)' }}>{item.d}</span>
                                <span className="text-[11px] font-bold block mt-0.5" style={{ color: gold }}>{item.p}</span>
                              </div>
                              <button onClick={() => setCart(c => c + 1)}
                                className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer"
                                style={{ background: 'linear-gradient(135deg, #C9A86C, #8A6835)', color: '#0D0B08' }}>
                                + Ekle
                              </button>
                            </div>
                          ))}
                          <button onClick={() => alert(`Kahve Erenköy için sipariş iletildi!`)}
                            className="w-full py-2.5 rounded-xl text-xs font-bold cursor-pointer flex items-center justify-center gap-1.5"
                            style={{ background: 'linear-gradient(135deg, #C9A86C, #8A6835)', color: '#0D0B08' }}>
                            <ShoppingBag className="w-3.5 h-3.5" /> Sipariş {cart > 0 && `(${cart})`}
                          </button>
                        </motion.div>
                      )}

                      {screen === 'actnoir' && (
                        <motion.div key="a" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          className="w-full space-y-2 mt-2">
                          <div className="p-3 rounded-xl flex items-center justify-between"
                            style={{ background: 'rgba(12,14,18,0.95)', border: '1px solid rgba(139,156,176,0.3)' }}>
                            <div>
                              <span className="text-xs font-black block" style={{ color: '#F0E6D3' }}>Act Noir Café</span>
                              <span className="text-[10px]" style={{ color: '#8B9CB0' }}>Moda • Butik Bakery</span>
                            </div>
                          </div>
                          {[{n:'Flat White Double Shot',d:'Kadifemsi Mikro Köpük',p:'140 TL'},{n:'Bademli Kruvasan',d:'Fransız Tereyağlı',p:'110 TL'}].map(item => (
                            <div key={item.n} className="p-2.5 rounded-xl flex items-center justify-between"
                              style={{ background: 'rgba(14,16,20,0.9)', border: '1px solid rgba(139,156,176,0.1)' }}>
                              <div>
                                <span className="text-xs font-bold block" style={{ color: '#F0E6D3' }}>{item.n}</span>
                                <span className="text-[10px]" style={{ color: 'rgba(180,152,104,0.6)' }}>{item.d}</span>
                                <span className="text-[11px] font-bold block mt-0.5" style={{ color: '#8B9CB0' }}>{item.p}</span>
                              </div>
                              <button onClick={() => setCart(c => c + 1)}
                                className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer"
                                style={{ background: '#3A4A5A', color: 'white' }}>
                                + Ekle
                              </button>
                            </div>
                          ))}
                          <button onClick={() => alert(`Act Noir için sipariş iletildi!`)}
                            className="w-full py-2.5 rounded-xl text-xs font-bold cursor-pointer flex items-center justify-center gap-1.5"
                            style={{ background: '#4A5A6A', color: 'white' }}>
                            <ShoppingBag className="w-3.5 h-3.5" /> Sipariş {cart > 0 && `(${cart})`}
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>

                {tapped && (
                  <button onClick={reset}
                    className="w-full py-2 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer mt-2 transition-colors"
                    style={{ background: 'rgba(201,168,108,0.08)', border: '1px solid rgba(201,168,108,0.15)', color: 'rgba(201,168,108,0.6)' }}>
                    <RotateCcw className="w-3 h-3" /> Sıfırla
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
