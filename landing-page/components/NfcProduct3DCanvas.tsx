'use client';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Locale } from '@/lib/translations';
import { translations } from '@/lib/translations';

type ProductType = 'stand' | 'card' | 'sticker';

interface Props {
  locale?: Locale;
}

export default function NfcProduct3DCanvas({ locale = 'tr' }: Props) {
  const [selected, setSelected] = useState<ProductType>('stand');
  const [rotation, setRotation] = useState({ x: 12, y: -25 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; startRotX: number; startRotY: number }>({
    startX: 0,
    startY: 0,
    startRotX: 12,
    startRotY: -25,
  });

  const t = translations[locale].canvas;

  const PRODUCTS: { id: ProductType; name: string; subtitle: string; tag: string; bgGradient: string }[] = [
    {
      id: 'stand',
      name: t.standTitle,
      subtitle: t.standSubtitle,
      tag: t.tagStand,
      bgGradient: 'from-amber-950/40 via-neutral-900 to-neutral-950',
    },
    {
      id: 'card',
      name: t.cardTitle,
      subtitle: t.cardSubtitle,
      tag: t.tagCard,
      bgGradient: 'from-yellow-950/40 via-neutral-900 to-neutral-950',
    },
    {
      id: 'sticker',
      name: t.stickerTitle,
      subtitle: t.stickerSubtitle,
      tag: t.tagSticker,
      bgGradient: 'from-blue-950/40 via-neutral-900 to-neutral-950',
    },
  ];

  const activeProduct = PRODUCTS.find((p) => p.id === selected)!;

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startRotX: rotation.x,
      startRotY: rotation.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragRef.current.startX;
    const deltaY = e.clientY - dragRef.current.startY;
    setRotation({
      x: Math.max(-45, Math.min(45, dragRef.current.startRotX - deltaY * 0.4)),
      y: dragRef.current.startRotY + deltaX * 0.5,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-8 px-4">
      {/* Product Selector Tabs */}
      <div className="flex items-center justify-center gap-2 mb-8 overflow-x-auto p-1 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 max-w-2xl mx-auto">
        {PRODUCTS.map((prod) => {
          const isActive = prod.id === selected;
          return (
            <button
              key={prod.id}
              onClick={() => {
                setSelected(prod.id);
                setRotation({ x: 12, y: -25 });
              }}
              className="relative px-5 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap shrink-0"
              style={{ color: isActive ? '#ffffff' : 'rgba(255,255,255,0.6)' }}
            >
              {isActive && (
                <motion.div
                  layoutId="active-3d-product-pill"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 shadow-lg shadow-amber-900/40"
                  transition={{ type: 'spring', damping: 24, stiffness: 280 }}
                />
              )}
              <span className="relative z-10">{prod.name.split(' ')[0]} {prod.name.split(' ')[1]}</span>
            </button>
          );
        })}
      </div>

      {/* 3D Viewport Box */}
      <div
        className={`relative w-full h-[420px] sm:h-[480px] rounded-3xl border border-white/10 overflow-hidden bg-gradient-to-b ${activeProduct.bgGradient} flex flex-col items-center justify-between p-6 cursor-grab active:cursor-grabbing select-none shadow-2xl`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Ambient Studio Lighting Reflections */}
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-amber-500/15 via-transparent to-transparent pointer-events-none" />

        {/* Viewport Header Tag */}
        <div className="relative z-10 flex items-center justify-between w-full">
          <span className="text-[11px] font-extrabold tracking-wider uppercase px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-inner">
            {activeProduct.tag}
          </span>
          <span className="text-[11px] text-white/40 tracking-wider font-medium">
            {t.dragHint}
          </span>
        </div>

        {/* 3D Canvas Geometry Render */}
        <div className="relative w-full h-64 flex items-center justify-center perspective-[1000px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={selected}
              initial={{ scale: 0.8, opacity: 0, rotateY: -60 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.8, opacity: 0, rotateY: 60 }}
              transition={{ type: 'spring', damping: 22, stiffness: 200 }}
              className="relative flex items-center justify-center"
              style={{
                transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Model 1: Ahşap & Akrilik Masa Standı */}
              {selected === 'stand' && (
                <div className="relative w-48 h-60 flex flex-col items-center justify-end">
                  {/* Acrylic Plate */}
                  <div className="w-40 h-48 bg-gradient-to-tr from-white/25 via-white/10 to-white/35 backdrop-blur-md rounded-2xl border border-white/50 shadow-2xl flex flex-col items-center justify-between p-4 transform translate-z-4">
                    <div className="w-9 h-9 rounded-full border border-amber-400/80 bg-amber-500/30 flex items-center justify-center text-amber-300 text-xs font-black shadow-inner">
                      NFC
                    </div>
                    <div className="text-center space-y-1">
                      <div className="w-16 h-16 mx-auto bg-neutral-900/90 rounded-xl p-1.5 border border-white/20 flex items-center justify-center">
                        <div className="w-full h-full bg-white rounded flex items-center justify-center text-black font-extrabold text-[10px]">
                          QR CODE
                        </div>
                      </div>
                      <p className="text-[10px] font-bold text-white/90 tracking-wide">DOKUN VEYA TARAT</p>
                    </div>
                    <div className="text-[9px] text-white/60 uppercase tracking-widest font-bold">NFCMyPlace</div>
                  </div>
                  {/* Solid Walnut Wood Base */}
                  <div className="w-52 h-9 bg-gradient-to-r from-amber-950 via-yellow-950 to-amber-950 rounded-xl border border-amber-700/60 shadow-2xl flex items-center justify-center text-[10px] font-bold text-amber-200/80 tracking-widest uppercase shadow-amber-950/60">
                    Doğal Ahşap Taban
                  </div>
                </div>
              )}

              {/* Model 2: Mat Siyah & Altın Varak Google Yorum Kartı */}
              {selected === 'card' && (
                <div className="w-64 h-40 bg-neutral-950 rounded-2xl border border-amber-500/50 shadow-2xl p-5 flex flex-col justify-between relative overflow-hidden transform translate-z-6">
                  <div className="absolute -top-12 -left-12 w-32 h-32 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs font-black tracking-widest text-amber-400 uppercase">Google Yorum Kartı</div>
                      <div className="text-[10px] text-amber-200/70 mt-0.5">5 Yıldız Yorum İçin Dokundurun</div>
                    </div>
                    <div className="text-amber-400 text-lg">⭐⭐⭐⭐⭐</div>
                  </div>
                  <div className="flex items-end justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full border border-amber-400/80 bg-amber-500/30 flex items-center justify-center text-amber-300 text-[10px] font-bold">
                        NFC
                      </div>
                      <span className="text-[9px] text-amber-300/90 font-mono font-bold">ALTIN VARAK NFC</span>
                    </div>
                    <div className="w-10 h-10 bg-amber-400/10 rounded border border-amber-400/30 p-1 flex items-center justify-center text-amber-300 font-extrabold text-[8px]">
                      QR
                    </div>
                  </div>
                </div>
              )}

              {/* Model 3: Endüstriyel Su Geçirmez NFC Masa Diski */}
              {selected === 'sticker' && (
                <div className="w-44 h-44 rounded-full bg-gradient-to-tr from-neutral-900 via-neutral-950 to-neutral-900 border-4 border-amber-500/60 shadow-2xl p-4 flex flex-col items-center justify-between text-center relative overflow-hidden transform translate-z-4">
                  <div className="w-7 h-7 rounded-full bg-amber-500/30 border border-amber-400/80 flex items-center justify-center text-amber-300 text-[9px] font-black mt-1">
                    NFC
                  </div>
                  <div className="my-auto">
                    <div className="text-xs font-black text-white tracking-wide">AKILLI MENÜ DISKI</div>
                    <div className="text-[9px] text-white/60">3M Su Geçirmez Reçine</div>
                  </div>
                  <div className="text-[9px] font-bold text-amber-400 tracking-widest uppercase mb-1">
                    NFCMyPlace
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Viewport Footer Product Details */}
        <div className="relative z-10 text-center space-y-1">
          <h3 className="text-lg font-black text-white">{activeProduct.name}</h3>
          <p className="text-xs text-white/60 max-w-lg mx-auto leading-relaxed">{activeProduct.subtitle}</p>
        </div>
      </div>
    </div>
  );
}
