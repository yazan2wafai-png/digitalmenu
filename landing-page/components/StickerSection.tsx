'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Gem,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Radio,
  TrendingDown,
} from 'lucide-react';
import type { Locale } from '@/lib/translations';
import { translations } from '@/lib/translations';
import type { LiveDemoItem } from '@/app/page';

export interface StickerSectionProps {
  locale?: Locale;
  onOrderClick?: () => void;
  demos?: LiveDemoItem[];
}

/* ────────────────────────────────────────────────────────────────
   PRICING: 2 materials × 3 quantity tiers, graduated discount.
   Only these 3 tiers are priced, so quantity is a tier picker, not
   a freeform stepper — an arbitrary qty would have no defined price.
   ──────────────────────────────────────────────────────────────── */
type StickerMaterial = 'akrilik' | 'plastik';

const MATERIAL_INFO: Record<
  StickerMaterial,
  { basePrice: number; nameTr: string; nameEn: string; finishTr: string; finishEn: string }
> = {
  akrilik: {
    basePrice: 150,
    nameTr: 'Akrilik',
    nameEn: 'Acrylic',
    finishTr: 'Parlak Akrilik (Cam Kaplama) • IP68 Sıvı Geçirmez',
    finishEn: 'Glossy Acrylic (Clearcoat Finish) • IP68 Waterproof',
  },
  plastik: {
    basePrice: 250,
    nameTr: 'Plastik',
    nameEn: 'Plastic',
    finishTr: 'Mat Dayanıklı Plastik • IP68 Sıvı Geçirmez',
    finishEn: 'Matte Durable Plastic • IP68 Waterproof',
  },
};

const QUANTITY_TIERS: { qty: 5 | 10 | 15; discountPct: number }[] = [
  { qty: 5, discountPct: 0 },
  { qty: 10, discountPct: 0.1 },
  { qty: 15, discountPct: 0.17 },
];

function computeTierPricing(basePrice: number, qty: number, discountPct: number) {
  const rawTotal = basePrice * qty;
  const total = Math.round(rawTotal * (1 - discountPct));
  const savings = rawTotal - total;
  return { rawTotal, total, savings };
}

/* ────────────────────────────────────────────────────────────────
   MINI STICKER "FAN": fixed angular/radial footprint so 15 stickers
   read as a denser fan rather than a wider (cluttered) one — the
   on-screen spread does not grow with quantity, only the density.
   ──────────────────────────────────────────────────────────────── */
const FAN_SPREAD_DEG = 34;
const FAN_ANGLE_OFFSET = 42; // biases the fan to the lower-right, clear of the coffee cup on the left
const FAN_RADIUS_MIN = 58;
const FAN_RADIUS_MAX = 156;

function fanTransform(index: number, total: number) {
  const t = total <= 1 ? 0.4 : index / (total - 1);
  const angle = FAN_ANGLE_OFFSET - FAN_SPREAD_DEG / 2 + t * FAN_SPREAD_DEG;
  const radius = FAN_RADIUS_MIN + t * (FAN_RADIUS_MAX - FAN_RADIUS_MIN);
  const rad = (angle * Math.PI) / 180;
  return {
    x: Math.sin(rad) * radius,
    y: Math.cos(rad) * radius * 0.5 + radius * 0.3,
    rotate: angle * 0.6,
  };
}

/* ────────────────────────────────────────────────────────────────
   AMBIENT COFFEE CUP — simple icon-illustration with looping steam.
   ──────────────────────────────────────────────────────────────── */
function CoffeeCup({ className = '' }: { className?: string }) {
  const strands = [
    { d: 'M -5,-16 C -9,-24 -1,-28 -4,-36 C -6,-42 1,-46 -2,-52', delay: 0 },
    { d: 'M 4,-16 C 9,-23 2,-29 6,-35 C 9,-41 2,-45 5,-51', delay: 1.4 },
    { d: 'M 0,-16 C -4,-25 5,-27 1,-34 C -2,-40 5,-44 2,-50', delay: 2.6 },
  ];

  return (
    <div className={className}>
      <svg viewBox="-30 -55 60 100" className="w-14 h-14 sm:w-[4.5rem] sm:h-[4.5rem]" fill="none">
        {/* Looping ambient steam — slow, staggered, fading strands */}
        <g opacity="0.9">
          {strands.map((s, i) => (
            <motion.path
              key={i}
              d={s.d}
              stroke="rgba(255,255,255,0.55)"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.65, 0], y: [6, -6, -16], x: [0, 2, -1, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: s.delay }}
            />
          ))}
        </g>

        {/* Saucer */}
        <ellipse cx="0" cy="34" rx="27" ry="5.5" fill="rgba(0,0,0,0.35)" />
        <ellipse cx="0" cy="31.5" rx="25" ry="5" fill="#E7DAC0" stroke="#B5651D" strokeWidth="1" opacity="0.95" />

        {/* Cup body */}
        <path
          d="M -18,-12 L -14,20 A 6,6 0 0 0 -8,25 H 8 A 6,6 0 0 0 14,20 L 18,-12 Z"
          fill="#241a12"
          stroke="#CB9361"
          strokeWidth="1.4"
        />

        {/* Coffee surface */}
        <ellipse cx="0" cy="-12" rx="17.5" ry="4.2" fill="#B5651D" opacity="0.9" />
        <ellipse cx="0" cy="-12.6" rx="14" ry="3.1" fill="#8a4a17" />
        <ellipse cx="0" cy="-12" rx="17.5" ry="4.2" fill="none" stroke="#F5BE4E" strokeWidth="0.8" opacity="0.6" />

        {/* Handle */}
        <path d="M 18,-4 C 32,-4 32,14 18,14" stroke="#CB9361" strokeWidth="4" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function demoBadgeChip(demo: LiveDemoItem) {
  return (
    <span
      className={`inline-flex items-center text-[9px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap ${demo.badgeColor}`}
    >
      {demo.tag}
    </span>
  );
}

export function StickerSection({ locale = 'tr', onOrderClick, demos = [] }: StickerSectionProps) {
  const [stickerMaterial, setStickerMaterial] = useState<StickerMaterial>('akrilik');
  const [stickerQuantity, setStickerQuantity] = useState<5 | 10 | 15>(10);
  const [activeDemoIndex, setActiveDemoIndex] = useState(0);
  const [isDemoAutoPaused, setIsDemoAutoPaused] = useState(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Kept for parity with the rest of the file (copy below uses inline locale
  // ternaries, same as the pre-existing convention in this component).
  const t = translations[locale];

  const isPlastik = stickerMaterial === 'plastik';
  const material = MATERIAL_INFO[stickerMaterial];
  const activeTier = QUANTITY_TIERS.find((tier) => tier.qty === stickerQuantity) ?? QUANTITY_TIERS[1];
  const pricing = computeTierPricing(material.basePrice, activeTier.qty, activeTier.discountPct);

  const activeDemo = demos.length > 0 ? demos[activeDemoIndex % demos.length] : null;

  // Slow auto-advance through the 3 live customers; pauses on manual pick,
  // then quietly resumes after a cooldown so it doesn't fight the visitor.
  useEffect(() => {
    if (demos.length <= 1 || isDemoAutoPaused) return;
    const id = setInterval(() => {
      setActiveDemoIndex((i) => (i + 1) % demos.length);
    }, 4800);
    return () => clearInterval(id);
  }, [demos.length, isDemoAutoPaused]);

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, []);

  const handleSelectDemo = (index: number) => {
    setActiveDemoIndex(index);
    setIsDemoAutoPaused(true);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => setIsDemoAutoPaused(false), 11000);
  };

  return (
    <section
      id="sticker"
      className="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-white/5 scroll-mt-20"
    >
      {/* ── SECTION HEADER ── */}
      <div className="text-center space-y-3 mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold tracking-wider uppercase backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{locale === 'tr' ? 'Hizmet 2: Masa Çözümleri' : 'Service 2: Table Solutions'}</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-100 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
          {locale === 'tr' ? 'Premium Masa Stickerı ' : 'Premium Table Sticker '}
          <span className="text-zinc-100 font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-amber-400 bg-clip-text text-transparent drop-shadow-sm inline-block">
            (NFC & QR Hibrit)
          </span>
        </h2>
        <p className="text-sm sm:text-base text-white/60 max-w-2xl mx-auto leading-relaxed">
          {locale === 'tr'
            ? 'Akrilik veya dayanıklı plastik gövde, 3M endüstriyel VHB yapışkan ve IP68 sıvı geçirmez koruma ile masalarınızı tek dokunuşla dijitalleştirin.'
            : 'Digitize your tables instantly — choose acrylic or durable plastic, with 3M industrial VHB adhesive and IP68 waterproof rating.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* ── LEFT: WOOD CAFÉ TABLE SCENE ── */}
        <div
          className="lg:col-span-7 relative min-h-[520px] sm:min-h-[580px] rounded-3xl border border-black/30 overflow-hidden p-6 sm:p-8 shadow-2xl flex flex-col justify-between backdrop-blur-2xl"
          style={{
            backgroundColor: '#4a2c16',
            backgroundImage:
              'radial-gradient(ellipse 75% 60% at 50% 40%, rgba(255,214,150,0.10) 0%, rgba(0,0,0,0) 62%),' +
              'repeating-linear-gradient(91deg, rgba(0,0,0,0.12) 0px, rgba(0,0,0,0.12) 1px, transparent 1px, transparent 3px),' +
              'repeating-linear-gradient(91deg, rgba(255,255,255,0.035) 0px, transparent 2px, transparent 9px, rgba(255,255,255,0.035) 11px),' +
              'linear-gradient(122deg, #3a2210 0%, #5c3a1e 18%, #7a4a24 36%, #603a1d 52%, #4a2c16 68%, #6b4423 84%, #3a2210 100%)',
          }}
        >
          {/* Edge vignette so the wood falls off toward the panel border */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at 50% 46%, transparent 45%, rgba(0,0,0,0.45) 100%)',
            }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-amber-500/10 via-yellow-500/5 to-transparent blur-3xl pointer-events-none" />

          {/* Top Bar: Badges */}
          <div className="relative z-20 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold tracking-wider uppercase px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {locale === 'tr'
                  ? `${material.nameTr} Hibrit Donanım`
                  : `${material.nameEn} Hybrid Hardware`}
              </span>
              <span className="text-[11px] font-black px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border border-amber-500/40">
                {material.basePrice} TL / {locale === 'tr' ? 'Adet' : 'Unit'}
              </span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-white/50">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{locale === 'tr' ? '3M Endüstriyel VHB' : '3M Industrial VHB'}</span>
            </div>
          </div>

          {/* Current-Customers "table card" — sits in the scene like a small
              table-tent, steps through the 3 live restaurants (auto + manual). */}
          {activeDemo && (
            <div className="relative z-20 flex justify-end -mt-1">
              <motion.div
                key={activeDemo.slug}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="w-full max-w-[210px] sm:max-w-[240px] rounded-2xl bg-cream/95 border border-black/10 shadow-xl p-3 sm:p-3.5"
                style={{ transform: 'rotate(-1.5deg)' }}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[9px] font-bold text-ink/45 uppercase tracking-wide">
                    {locale === 'tr' ? 'Şu An Kullanan' : 'Currently Using'}
                  </span>
                  {demoBadgeChip(activeDemo)}
                </div>
                <h5 className="text-xs sm:text-sm font-black text-ink leading-tight truncate">
                  {activeDemo.name}
                </h5>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-ink/10">
                  <div className="flex items-center gap-1.5">
                    {demos.map((d, i) => (
                      <button
                        key={d.slug}
                        type="button"
                        onClick={() => handleSelectDemo(i)}
                        aria-label={d.name}
                        className={`h-1.5 rounded-full transition-all cursor-pointer ${
                          i === activeDemoIndex ? 'w-4 bg-terracotta' : 'w-1.5 bg-ink/20 hover:bg-ink/35'
                        }`}
                      />
                    ))}
                  </div>
                  <a
                    href={activeDemo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-0.5 text-[10px] font-black text-terracotta hover:text-terracotta-light transition-colors cursor-pointer"
                  >
                    <span>{locale === 'tr' ? 'Canlı Menü' : 'Live Menu'}</span>
                    <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                  </a>
                </div>
              </motion.div>
            </div>
          )}

          {/* Center Table Stage: coffee cup, fanned mini stickers, hero disc */}
          <div className="relative my-auto flex items-center justify-center py-6 z-10 min-h-[280px] sm:min-h-[320px]">
            {/* Coffee cup prop, resting to the left on the table */}
            <div className="absolute left-0 sm:left-4 bottom-2 sm:bottom-6 z-10 opacity-95">
              <CoffeeCup />
            </div>

            {/* Ambient Drop Shadow */}
            <div className="absolute w-64 h-64 sm:w-76 sm:h-76 rounded-full bg-black/85 blur-2xl pointer-events-none transform translate-y-6" />

            {/* Fanned mini sticker replicas — count follows quantity (5/10/15),
                each new one staggers in, footprint stays fixed so it never clutters */}
            <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 6 }}>
              <AnimatePresence>
                {Array.from({ length: stickerQuantity }).map((_, i) => {
                  const pos = fanTransform(i, stickerQuantity);
                  return (
                    <div
                      key={i}
                      className="absolute left-1/2 top-1/2"
                      style={{
                        transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))`,
                      }}
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 0, rotate: pos.rotate - 12 }}
                        animate={{ opacity: 1, scale: 1, rotate: pos.rotate }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ type: 'spring', damping: 18, stiffness: 260, delay: i * 0.045 }}
                        className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full border-2 flex items-center justify-center shadow-lg ${
                          isPlastik
                            ? 'border-zinc-300/70 bg-gradient-to-b from-[#efece4] to-[#d9d4c6]'
                            : 'border-amber-400/70 bg-gradient-to-b from-[#181820] to-[#08080a]'
                        }`}
                      >
                        <Radio className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isPlastik ? 'text-ink/45' : 'text-amber-400/70'}`} />
                      </motion.div>
                    </div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* 2mm Disc Body with Glass Edge Bevels & Specular Reflection — material-keyed cross-fade */}
            <motion.div
              key={stickerMaterial}
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 22, stiffness: 280 }}
              className={`relative w-64 h-64 sm:w-80 sm:h-80 aspect-square rounded-full flex items-center justify-center select-none group cursor-pointer overflow-hidden transition-all duration-300 z-20 ${
                isPlastik
                  ? 'border-[5px] border-zinc-300/80 bg-gradient-to-b from-[#f2f0ea] via-[#e9e5da] to-[#d9d4c6] ring-2 ring-zinc-300/40 shadow-[0_16px_40px_rgba(0,0,0,0.3),0_0_20px_rgba(0,0,0,0.15),inset_0_2px_3px_rgba(255,255,255,0.6),inset_0_-2px_5px_rgba(0,0,0,0.1)]'
                  : 'border-[5px] border-amber-400 bg-gradient-to-b from-[#181820] via-[#101015] to-[#08080a] ring-2 ring-amber-400/60 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_35px_rgba(245,158,11,0.3),inset_0_2px_4px_rgba(255,255,255,0.35),inset_0_-2px_6px_rgba(0,0,0,0.85)]'
              }`}
            >
              {/* Material-Keyed Clearcoat Reflection — glossy for acrylic, muted for matte plastic */}
              <div
                className="absolute inset-0 pointer-events-none rounded-full z-20"
                style={{
                  background: isPlastik
                    ? 'linear-gradient(135deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.04) 40%, transparent 60%, rgba(255,255,255,0.02) 80%, rgba(255,255,255,0.08) 100%)'
                    : 'linear-gradient(135deg, rgba(255,255,255,0.38) 0%, rgba(255,255,255,0.10) 36%, transparent 56%, rgba(255,255,255,0.05) 75%, rgba(255,255,255,0.22) 100%)',
                }}
              />

              {/* Outer Clearcoat Bevel Rim */}
              <div
                className="absolute inset-1 rounded-full pointer-events-none border z-20"
                style={{
                  borderColor: isPlastik ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)',
                  boxShadow: isPlastik
                    ? 'inset 0 1px 2px rgba(255,255,255,0.55)'
                    : 'inset 0 1px 3px rgba(255,255,255,0.25)',
                }}
              />

              {/* Sheen sweep — plays once whenever the material changes (this whole
                  disc remounts via key={stickerMaterial}, so this mounts fresh too) */}
              <motion.div
                className="absolute -inset-y-6 z-30 pointer-events-none"
                style={{
                  width: '38%',
                  left: '-30%',
                  background:
                    'linear-gradient(115deg, transparent 0%, rgba(255,255,255,0.05) 32%, rgba(255,255,255,0.75) 48%, rgba(255,255,255,0.95) 50%, rgba(255,255,255,0.75) 52%, rgba(255,255,255,0.05) 68%, transparent 100%)',
                  transform: 'skewX(-18deg)',
                }}
                initial={{ x: '-40%', opacity: 0 }}
                animate={{ x: '360%', opacity: [0, 1, 1, 0] }}
                transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
              />

              {/* ── SVG HIGH PRECISION VECTOR GRAPHIC ── */}
              <svg
                viewBox="0 0 360 360"
                className="w-full h-full p-2 relative z-10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* Arc Path for Bottom Curved Text "MENÜYÜ GÖRÜNTÜLEYİN" */}
                  <path
                    id="stickerBottomArc"
                    d="M 46,180 A 134,134 0 0,0 314,180"
                    fill="none"
                  />

                  {/* Golden Metallic Gradient */}
                  <linearGradient id="stickerGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFF2A3" />
                    <stop offset="25%" stopColor="#F5BE4E" />
                    <stop offset="60%" stopColor="#D98A1E" />
                    <stop offset="100%" stopColor="#B36E08" />
                  </linearGradient>

                  <linearGradient id="stickerGoldGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FDE68A" />
                    <stop offset="50%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#D97706" />
                  </linearGradient>
                </defs>

                {/* Outer Delicate Gold Rim Circle */}
                <circle
                  cx="180"
                  cy="180"
                  r="168"
                  stroke="url(#stickerGoldGrad)"
                  strokeWidth="2.5"
                />

                {/* Inner Precision Hairline Ring */}
                <circle
                  cx="180"
                  cy="180"
                  r="159"
                  stroke="rgba(251, 191, 36, 0.45)"
                  strokeWidth="1.2"
                />

                {/* ── 1. HEADER: CROSSED FORK & KNIFE EMBLEM + "MENU" + "— TARAYIN —" ── */}
                <g transform="translate(180, 52)">
                  {/* Crossed Fork & Knife Emblem */}
                  <g transform="translate(0, 0)">
                    {/* Fork (Left to Right crossing) */}
                    <g transform="rotate(-28)">
                      <path d="M 0,2 L 0,17" stroke="url(#stickerGoldGrad)" strokeWidth="1.8" strokeLinecap="round" />
                      <path d="M -4.5,-2 C -4.5,2.5 4.5,2.5 4.5,-2" stroke="url(#stickerGoldGrad)" strokeWidth="1.4" fill="none" />
                      <line x1="-3.5" y1="-2" x2="-3.5" y2="-9.5" stroke="url(#stickerGoldGrad)" strokeWidth="1.2" strokeLinecap="round" />
                      <line x1="0" y1="-2" x2="0" y2="-11" stroke="url(#stickerGoldGrad)" strokeWidth="1.2" strokeLinecap="round" />
                      <line x1="3.5" y1="-2" x2="3.5" y2="-9.5" stroke="url(#stickerGoldGrad)" strokeWidth="1.2" strokeLinecap="round" />
                    </g>

                    {/* Knife (Right to Left crossing) */}
                    <g transform="rotate(28)">
                      <path d="M 0,2 L 0,17" stroke="url(#stickerGoldGrad)" strokeWidth="1.8" strokeLinecap="round" />
                      <path d="M 0,2 L 0,-11 C 0,-11 5,-8 5,-2 C 5,2 0,2 0,2 Z" fill="url(#stickerGoldGrad)" />
                    </g>
                  </g>

                  {/* "MENU" Typography */}
                  <text
                    y="29"
                    textAnchor="middle"
                    fill={isPlastik ? '#92400e' : 'url(#stickerGoldGrad)'}
                    fontSize="18"
                    fontWeight="900"
                    letterSpacing="4"
                    className="uppercase font-sans"
                  >
                    MENU
                  </text>

                  {/* Sub-line: "— TARAYIN —" */}
                  <text
                    y="42"
                    textAnchor="middle"
                    fill={isPlastik ? '#b45309' : '#fbbf24'}
                    fontSize="9.5"
                    fontWeight="800"
                    letterSpacing="2.2"
                    className="uppercase font-sans opacity-95"
                  >
                    — TARAYIN —
                  </text>
                </g>

                {/* ── 2. SIDES: GOLD CONCENTRIC NFC RADAR ARCS ((( ))) ── */}
                <g stroke="url(#stickerGoldGrad)" strokeWidth="2.6" strokeLinecap="round" opacity="0.95">
                  <path d="M 98,152 A 40,40 0 0,0 98,208" />
                  <path d="M 82,138 A 58,58 0 0,0 82,222" strokeWidth="2.2" opacity="0.75" />
                  <path d="M 66,124 A 76,76 0 0,0 66,236" strokeWidth="1.6" opacity="0.45" />
                </g>

                <g stroke="url(#stickerGoldGrad)" strokeWidth="2.6" strokeLinecap="round" opacity="0.95">
                  <path d="M 262,152 A 40,40 0 0,1 262,208" />
                  <path d="M 278,138 A 58,58 0 0,1 278,222" strokeWidth="2.2" opacity="0.75" />
                  <path d="M 294,124 A 76,76 0 0,1 294,236" strokeWidth="1.6" opacity="0.45" />
                </g>

                {/* ── 3. CENTER: SQUARE QR MATRIX WITH DOUBLE ROUNDED CORNER BRACKETS ── */}
                <g transform="translate(180, 180)">
                  <g stroke="url(#stickerGoldGrad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none">
                    <path d="M -60,-42 L -60,-56 A 7,7 0 0,1 -53,-63 L -39,-63" />
                    <path d="M 39,-63 L 53,-63 A 7,7 0 0,1 60,-56 L 60,-42" />
                    <path d="M -60,42 L -60,56 A 7,7 0 0,0 -53,63 L -39,63" />
                    <path d="M 39,63 L 53,63 A 7,7 0 0,0 60,56 L 60,42" />
                  </g>

                  <g stroke="rgba(251, 191, 36, 0.5)" strokeWidth="1.2" strokeLinecap="round" fill="none">
                    <path d="M -54,-40 L -54,-51 A 4,4 0 0,1 -50,-55 L -39,-55" />
                    <path d="M 39,-55 L 50,-55 A 4,4 0 0,1 54,-51 L 54,-40" />
                    <path d="M -54,40 L -54,51 A 4,4 0 0,0 -50,55 L -39,55" />
                    <path d="M 39,55 L 50,55 A 4,4 0 0,0 54,51 L 54,40" />
                  </g>

                  <rect x="-47" y="-47" width="94" height="94" rx="14" fill="#ffffff" stroke="url(#stickerGoldGrad)" strokeWidth="2.4" />

                  {/* Top-Left Finder */}
                  <rect x="-38" y="-38" width="24" height="24" fill="#0a0a0c" rx="4" />
                  <rect x="-34" y="-34" width="16" height="16" fill="#ffffff" rx="2.5" />
                  <rect x="-31" y="-31" width="10" height="10" fill="#0a0a0c" rx="1.5" />

                  {/* Top-Right Finder */}
                  <rect x="14" y="-38" width="24" height="24" fill="#0a0a0c" rx="4" />
                  <rect x="18" y="-34" width="16" height="16" fill="#ffffff" rx="2.5" />
                  <rect x="21" y="-31" width="10" height="10" fill="#0a0a0c" rx="1.5" />

                  {/* Bottom-Left Finder */}
                  <rect x="-38" y="14" width="24" height="24" fill="#0a0a0c" rx="4" />
                  <rect x="-34" y="18" width="16" height="16" fill="#ffffff" rx="2.5" />
                  <rect x="-31" y="21" width="10" height="10" fill="#0a0a0c" rx="1.5" />

                  {/* QR Data Cells */}
                  <rect x="-7" y="-38" width="4.5" height="4.5" fill="#0a0a0c" />
                  <rect x="2.5" y="-38" width="4.5" height="4.5" fill="#0a0a0c" />
                  <rect x="-7" y="-29" width="4.5" height="4.5" fill="#0a0a0c" />
                  <rect x="-38" y="-7" width="4.5" height="4.5" fill="#0a0a0c" />
                  <rect x="-29" y="-7" width="4.5" height="4.5" fill="#0a0a0c" />
                  <rect x="22" y="-7" width="4.5" height="4.5" fill="#0a0a0c" />
                  <rect x="31" y="-7" width="4.5" height="4.5" fill="#0a0a0c" />
                  <rect x="-7" y="22" width="4.5" height="4.5" fill="#0a0a0c" />
                  <rect x="2.5" y="31" width="4.5" height="4.5" fill="#0a0a0c" />
                  <rect x="13.5" y="13.5" width="4.5" height="4.5" fill="#0a0a0c" />
                  <rect x="22" y="22" width="4.5" height="4.5" fill="#0a0a0c" />
                  <rect x="31" y="31" width="4.5" height="4.5" fill="#0a0a0c" />
                  <rect x="31" y="13.5" width="4.5" height="4.5" fill="#0a0a0c" />
                  <rect x="13.5" y="31" width="4.5" height="4.5" fill="#0a0a0c" />

                  {/* Center Mini NFC Badge */}
                  <circle cx="0" cy="0" r="10" fill="#ffffff" stroke="url(#stickerGoldGrad)" strokeWidth="1.8" />
                  <text x="0" y="3.5" textAnchor="middle" fill="#0a0a0c" fontSize="7.5" fontWeight="900" letterSpacing="0.5">
                    NFC
                  </text>
                </g>

                {/* ── 4. BOTTOM: CURVED SUBTEXT + 3 GOLD ACCENT DOTS ── */}
                <text
                  fontSize="11.5"
                  fontWeight="800"
                  fill={isPlastik ? '#1e293b' : '#ffffff'}
                  letterSpacing="2.6"
                  className="uppercase tracking-widest font-sans drop-shadow-sm"
                >
                  <textPath href="#stickerBottomArc" startOffset="50%" textAnchor="middle">
                    MENÜYÜ GÖRÜNTÜLEYİN
                  </textPath>
                </text>

                <g transform="translate(180, 312)">
                  <circle cx="-14" cy="0" r="3" fill="url(#stickerGoldGrad)" />
                  <circle cx="0" cy="0" r="3.8" fill="url(#stickerGoldGrad)" />
                  <circle cx="14" cy="0" r="3" fill="url(#stickerGoldGrad)" />
                </g>

                <text
                  x="180"
                  y="336"
                  textAnchor="middle"
                  fill={isPlastik ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.55)'}
                  fontSize="7.5"
                  fontWeight="700"
                  letterSpacing="1.2"
                >
                  ⚡ NFCMyPlace® Smart Table
                </text>
              </svg>
            </motion.div>
          </div>

          {/* Bottom Info Strip */}
          <div className="relative z-20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-white/10">
            <div>
              <h4 className="text-sm font-bold text-white">
                {locale === 'tr' ? 'Ø 65mm NFC & QR Hibrit Sticker' : 'Ø 65mm NFC & QR Hybrid Sticker'}
              </h4>
              <p className="text-xs text-white/50">
                {locale === 'tr' ? material.finishTr : material.finishEn}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-white/50 block font-semibold">{locale === 'tr' ? 'Birim Fiyat' : 'Unit Price'}</span>
              <span className="text-base font-black text-amber-400">{material.basePrice} TL / {locale === 'tr' ? 'adet' : 'unit'}</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT: LIVE CUSTOMIZER & QUANTITY CALCULATOR ── */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-6">
          {/* Material Switcher Card */}
          <div className="rounded-3xl border border-white/10 bg-neutral-900/80 backdrop-blur-xl p-6 shadow-2xl space-y-4">
            <h4 className="text-sm font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Gem className="w-4 h-4 text-amber-400" />
              <span>{locale === 'tr' ? 'Sticker Materyali' : 'Sticker Material'}</span>
            </h4>

            {/* Material Switcher: Akrilik vs Plastik — each its own product & price */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setStickerMaterial('akrilik')}
                className={`p-3.5 rounded-2xl border text-left text-xs font-bold flex flex-col gap-1.5 transition-all cursor-pointer ${
                  stickerMaterial === 'akrilik'
                    ? 'border-amber-500 bg-amber-500/15 text-white ring-2 ring-amber-500/40 shadow-lg shadow-amber-500/10'
                    : 'border-white/10 bg-white/[0.03] text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-4 h-4 rounded-full border border-neutral-700 bg-gradient-to-b from-neutral-800 to-black shrink-0 shadow-inner" />
                  <span className="flex-1 truncate font-bold">{locale === 'tr' ? 'Akrilik' : 'Acrylic'}</span>
                  {stickerMaterial === 'akrilik' && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                </div>
                <span className={`text-[10px] font-bold ${stickerMaterial === 'akrilik' ? 'text-amber-300' : 'text-white/40'}`}>
                  150 TL / {locale === 'tr' ? 'adet' : 'unit'} · {locale === 'tr' ? 'Parlak Cam Kaplama' : 'Glossy Clearcoat'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setStickerMaterial('plastik')}
                className={`p-3.5 rounded-2xl border text-left text-xs font-bold flex flex-col gap-1.5 transition-all cursor-pointer ${
                  stickerMaterial === 'plastik'
                    ? 'border-amber-500 bg-amber-500/15 text-white ring-2 ring-amber-500/40 shadow-lg shadow-amber-500/10'
                    : 'border-white/10 bg-white/[0.03] text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-4 h-4 rounded-full border border-zinc-400 bg-gradient-to-b from-zinc-100 to-zinc-300 shrink-0 shadow-sm" />
                  <span className="flex-1 truncate font-bold">{locale === 'tr' ? 'Plastik' : 'Plastic'}</span>
                  {stickerMaterial === 'plastik' && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                </div>
                <span className={`text-[10px] font-bold ${stickerMaterial === 'plastik' ? 'text-amber-300' : 'text-white/40'}`}>
                  250 TL / {locale === 'tr' ? 'adet' : 'unit'} · {locale === 'tr' ? 'Mat Dayanıklı' : 'Matte Durable'}
                </span>
              </button>
            </div>

            {/* Feature specs list */}
            <div className="pt-2 space-y-2 text-xs text-white/70">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.02] border border-white/5">
                <Layers className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>
                  {isPlastik
                    ? (locale === 'tr' ? 'Enjeksiyon Kalıplı Dayanıklı Plastik Gövde' : 'Injection-Molded Durable Plastic Body')
                    : (locale === 'tr' ? '2mm Lazer Kesim Pleksi Akrilik Gövde' : '2mm Laser Cut Plexi Acrylic Body')}
                </span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.02] border border-white/5">
                <Radio className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{locale === 'tr' ? 'NTAG213 Çip & Yüksek Kontrastlı QR Matrisi' : 'NTAG213 Chip & High Contrast QR Matrix'}</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.02] border border-white/5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{locale === 'tr' ? '3M Endüstriyel VHB Güçlü Su Geçirmez Yapışkan' : '3M Industrial VHB Heavy-Duty Waterproof Bond'}</span>
              </div>
            </div>
          </div>

          {/* Quantity Tier Selector & Live Subtotal Calculator Card */}
          <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-b from-neutral-900/90 via-neutral-900/70 to-neutral-950 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black uppercase tracking-wider text-amber-400">
                {locale === 'tr' ? 'Adet Seçimi & Fiyat Hesaplayıcı' : 'Quantity & Live Subtotal'}
              </h4>
              <span className="text-[11px] font-bold text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                {material.basePrice} TL / {locale === 'tr' ? 'adet' : 'unit'}
              </span>
            </div>

            {/* Quantity Tiers: 5 / 10 / 15 — pricing is only defined at these tiers */}
            <div className="grid grid-cols-3 gap-2">
              {QUANTITY_TIERS.map((tier) => {
                const tierPricing = computeTierPricing(material.basePrice, tier.qty, tier.discountPct);
                const isActive = stickerQuantity === tier.qty;
                return (
                  <button
                    key={tier.qty}
                    type="button"
                    onClick={() => setStickerQuantity(tier.qty)}
                    className={`py-2.5 px-2 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${
                      isActive
                        ? 'border-amber-500 bg-amber-500 text-black font-black shadow-md shadow-amber-500/25'
                        : 'border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <div>{tier.qty}x {locale === 'tr' ? 'Adet' : 'Units'}</div>
                    <div className={`text-[10px] mt-0.5 ${isActive ? 'text-black/80 font-bold' : 'text-amber-400'}`}>
                      {tierPricing.total.toLocaleString('tr-TR')} TL
                    </div>
                    {tier.discountPct > 0 && (
                      <div
                        className={`text-[9px] mt-0.5 font-black inline-flex items-center gap-0.5 ${
                          isActive ? 'text-emerald-900' : 'text-emerald-400'
                        }`}
                      >
                        <TrendingDown className="w-2.5 h-2.5" />
                        <span>%{Math.round(tier.discountPct * 100)} {locale === 'tr' ? 'indirim' : 'off'}</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Savings callout for the selected tier */}
            {pricing.savings > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold">
                <TrendingDown className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {locale === 'tr'
                    ? `${pricing.savings.toLocaleString('tr-TR')} TL tasarruf ediyorsunuz (%${Math.round(activeTier.discountPct * 100)} indirim)`
                    : `You save ${pricing.savings.toLocaleString('tr-TR')} TL (${Math.round(activeTier.discountPct * 100)}% off)`}
                </span>
              </div>
            )}

            {/* Live Subtotal Display & CTA */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <div>
                <div className="text-xs text-white/50 font-semibold">
                  {locale === 'tr' ? 'Hesaplanan Tutar' : 'Subtotal'}
                </div>
                <div className="text-2xl font-black text-amber-400">
                  {pricing.total.toLocaleString('tr-TR')} TL
                </div>
              </div>
              <button
                type="button"
                onClick={onOrderClick}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-xs shadow-lg shadow-amber-500/25 transition-all flex items-center gap-1.5 cursor-pointer transform active:scale-95"
              >
                <span>{locale === 'tr' ? 'Adet Seç & Sipariş Ver' : 'Order Selected Qty'}</span>
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StickerSection;
