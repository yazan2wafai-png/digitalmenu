'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Palette,
  Plus,
  Minus,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Radio,
} from 'lucide-react';
import type { Locale } from '@/lib/translations';
import { translations } from '@/lib/translations';

export interface StickerSectionProps {
  locale?: Locale;
  onOrderClick?: () => void;
}

export function StickerSection({ locale = 'tr', onOrderClick }: StickerSectionProps) {
  const [stickerColor, setStickerColor] = useState<'black' | 'white'>('black');
  const [stickerQuantity, setStickerQuantity] = useState<number>(10);

  const t = translations[locale];
  const stickerSubtotal = stickerQuantity * 175;
  const isWhite = stickerColor === 'white';

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
          {locale === 'tr' ? 'Premium Akrilik Masa Stickerı ' : 'Premium Acrylic Table Sticker '}
          <span className="text-zinc-100 font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-amber-400 bg-clip-text text-transparent drop-shadow-sm inline-block">
            (NFC & QR Hibrit)
          </span>
        </h2>
        <p className="text-sm sm:text-base text-white/60 max-w-2xl mx-auto leading-relaxed">
          {locale === 'tr'
            ? 'Ultra dayanıklı 2mm lazer kesim pleksi akrilik, 3M endüstriyel VHB yapışkan ve IP68 sıvı geçirmez koruma ile masalarınızı tek dokunuşla dijitalleştirin.'
            : 'Digitize your tables instantly with ultra-durable 2mm laser-cut plexi acrylic, 3M industrial VHB adhesive, and IP68 waterproof rating.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* ── LEFT: STUDIO PEDESTAL ACRYLIC STICKER SHOWCASE ── */}
        <div className="lg:col-span-7 relative min-h-[500px] sm:min-h-[550px] rounded-3xl border border-white/10 overflow-hidden p-6 sm:p-8 shadow-2xl flex flex-col justify-between bg-gradient-to-b from-[#16161a] via-[#1a1a22] to-[#222228] backdrop-blur-2xl">
          {/* Studio Pedestal Lighting */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at 50% 45%, rgba(60, 60, 75, 0.35) 0%, rgba(26, 26, 32, 0.7) 60%, rgba(18, 18, 22, 0.95) 100%)',
            }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-amber-500/10 via-yellow-500/5 to-transparent blur-3xl pointer-events-none" />

          {/* Top Bar: Badges */}
          <div className="relative z-20 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold tracking-wider uppercase px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {locale === 'tr' ? 'Akrilik Hibrit Donanım' : 'Acrylic Hybrid Hardware'}
              </span>
              <span className="text-[11px] font-black px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border border-amber-500/40">
                175 TL / Adet
              </span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-white/50">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{locale === 'tr' ? '3M Endüstriyel VHB' : '3M Industrial VHB'}</span>
            </div>
          </div>

          {/* Center Realistic Circular Acrylic Sticker Disc (Reference Image 2) */}
          <div className="relative my-auto flex items-center justify-center py-6 z-10">
            {/* Ambient Drop Shadow */}
            <div className="absolute w-64 h-64 sm:w-76 sm:h-76 rounded-full bg-black/85 blur-2xl pointer-events-none transform translate-y-6" />

            {/* 2mm Acrylic Disc Body with Glass Edge Bevels & Specular Reflection */}
            <motion.div
              key={stickerColor}
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 22, stiffness: 280 }}
              className={`relative w-64 h-64 sm:w-80 sm:h-80 aspect-square rounded-full flex items-center justify-center select-none group cursor-pointer overflow-hidden transition-all duration-300 ${
                isWhite
                  ? 'border-[5px] border-amber-400/90 bg-gradient-to-b from-[#ffffff] via-[#f8fafc] to-[#e2e8f0] ring-2 ring-amber-400/50 shadow-[0_20px_50px_rgba(0,0,0,0.35),0_0_30px_rgba(245,158,11,0.2),inset_0_2px_4px_rgba(255,255,255,0.9),inset_0_-2px_6px_rgba(0,0,0,0.12)]'
                  : 'border-[5px] border-amber-400 bg-gradient-to-b from-[#181820] via-[#101015] to-[#08080a] ring-2 ring-amber-400/60 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_35px_rgba(245,158,11,0.3),inset_0_2px_4px_rgba(255,255,255,0.35),inset_0_-2px_6px_rgba(0,0,0,0.85)]'
              }`}
            >
              {/* Glossy Acrylic Diagonal Clearcoat Reflection */}
              <div
                className="absolute inset-0 pointer-events-none rounded-full z-20"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(255,255,255,0.38) 0%, rgba(255,255,255,0.10) 36%, transparent 56%, rgba(255,255,255,0.05) 75%, rgba(255,255,255,0.22) 100%)',
                }}
              />

              {/* Polished Glass 2mm Outer Clearcoat Bevel Rim */}
              <div
                className="absolute inset-1 rounded-full pointer-events-none border z-20"
                style={{
                  borderColor: isWhite ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.2)',
                  boxShadow: isWhite
                    ? 'inset 0 1px 2px rgba(255,255,255,0.8)'
                    : 'inset 0 1px 3px rgba(255,255,255,0.25)',
                }}
              />

              {/* ── SVG HIGH PRECISION VECTOR GRAPHIC (IMAGE 2 EXACT SPEC) ── */}
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
                  {/* Crossed Fork & Knife (🍴) Emblem */}
                  <g transform="translate(0, 0)">
                    {/* Fork (Left to Right crossing) */}
                    <g transform="rotate(-28)">
                      {/* Fork Handle */}
                      <path
                        d="M 0,2 L 0,17"
                        stroke="url(#stickerGoldGrad)"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                      {/* Fork Base */}
                      <path
                        d="M -4.5,-2 C -4.5,2.5 4.5,2.5 4.5,-2"
                        stroke="url(#stickerGoldGrad)"
                        strokeWidth="1.4"
                        fill="none"
                      />
                      {/* 3 Prongs */}
                      <line x1="-3.5" y1="-2" x2="-3.5" y2="-9.5" stroke="url(#stickerGoldGrad)" strokeWidth="1.2" strokeLinecap="round" />
                      <line x1="0" y1="-2" x2="0" y2="-11" stroke="url(#stickerGoldGrad)" strokeWidth="1.2" strokeLinecap="round" />
                      <line x1="3.5" y1="-2" x2="3.5" y2="-9.5" stroke="url(#stickerGoldGrad)" strokeWidth="1.2" strokeLinecap="round" />
                    </g>

                    {/* Knife (Right to Left crossing) */}
                    <g transform="rotate(28)">
                      {/* Knife Handle */}
                      <path
                        d="M 0,2 L 0,17"
                        stroke="url(#stickerGoldGrad)"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                      {/* Knife Blade */}
                      <path
                        d="M 0,2 L 0,-11 C 0,-11 5,-8 5,-2 C 5,2 0,2 0,2 Z"
                        fill="url(#stickerGoldGrad)"
                      />
                    </g>
                  </g>

                  {/* "MENU" Typography */}
                  <text
                    y="29"
                    textAnchor="middle"
                    fill="url(#stickerGoldGrad)"
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
                    fill={isWhite ? '#b45309' : '#fbbf24'}
                    fontSize="9.5"
                    fontWeight="800"
                    letterSpacing="2.2"
                    className="uppercase font-sans opacity-95"
                  >
                    — TARAYIN —
                  </text>
                </g>

                {/* ── 2. SIDES: GOLD CONCENTRIC NFC RADAR ARCS ((( ))) ── */}
                {/* Left Concentric Radar Arcs */}
                <g stroke="url(#stickerGoldGrad)" strokeWidth="2.6" strokeLinecap="round" opacity="0.95">
                  <path d="M 98,152 A 40,40 0 0,0 98,208" />
                  <path d="M 82,138 A 58,58 0 0,0 82,222" strokeWidth="2.2" opacity="0.75" />
                  <path d="M 66,124 A 76,76 0 0,0 66,236" strokeWidth="1.6" opacity="0.45" />
                </g>

                {/* Right Concentric Radar Arcs */}
                <g stroke="url(#stickerGoldGrad)" strokeWidth="2.6" strokeLinecap="round" opacity="0.95">
                  <path d="M 262,152 A 40,40 0 0,1 262,208" />
                  <path d="M 278,138 A 58,58 0 0,1 278,222" strokeWidth="2.2" opacity="0.75" />
                  <path d="M 294,124 A 76,76 0 0,1 294,236" strokeWidth="1.6" opacity="0.45" />
                </g>

                {/* ── 3. CENTER: SQUARE QR MATRIX WITH DOUBLE ROUNDED CORNER BRACKETS [ QR ] ── */}
                <g transform="translate(180, 180)">
                  {/* Outer Corner Brackets [ ] */}
                  <g stroke="url(#stickerGoldGrad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none">
                    {/* Top-Left Bracket */}
                    <path d="M -60,-42 L -60,-56 A 7,7 0 0,1 -53,-63 L -39,-63" />
                    {/* Top-Right Bracket */}
                    <path d="M 39,-63 L 53,-63 A 7,7 0 0,1 60,-56 L 60,-42" />
                    {/* Bottom-Left Bracket */}
                    <path d="M -60,42 L -60,56 A 7,7 0 0,0 -53,63 L -39,63" />
                    {/* Bottom-Right Bracket */}
                    <path d="M 39,63 L 53,63 A 7,7 0 0,0 60,56 L 60,42" />
                  </g>

                  {/* Inner Fine Corner Brackets */}
                  <g stroke="rgba(251, 191, 36, 0.5)" strokeWidth="1.2" strokeLinecap="round" fill="none">
                    <path d="M -54,-40 L -54,-51 A 4,4 0 0,1 -50,-55 L -39,-55" />
                    <path d="M 39,-55 L 50,-55 A 4,4 0 0,1 54,-51 L 54,-40" />
                    <path d="M -54,40 L -54,51 A 4,4 0 0,0 -50,55 L -39,55" />
                    <path d="M 39,55 L 50,55 A 4,4 0 0,0 54,51 L 54,40" />
                  </g>

                  {/* QR Background Card */}
                  <rect
                    x="-47"
                    y="-47"
                    width="94"
                    height="94"
                    rx="14"
                    fill="#ffffff"
                    stroke="url(#stickerGoldGrad)"
                    strokeWidth="2.4"
                  />

                  {/* Scannable Crisp QR Code Matrix */}
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
                  <text
                    x="0"
                    y="3.5"
                    textAnchor="middle"
                    fill="#0a0a0c"
                    fontSize="7.5"
                    fontWeight="900"
                    letterSpacing="0.5"
                  >
                    NFC
                  </text>
                </g>

                {/* ── 4. BOTTOM: CURVED SUBTEXT "MENÜYÜ GÖRÜNTÜLEYİN" + 3 GOLD ACCENT DOTS ── */}
                <text
                  fontSize="11.5"
                  fontWeight="800"
                  fill={isWhite ? '#1e293b' : '#ffffff'}
                  letterSpacing="2.6"
                  className="uppercase tracking-widest font-sans drop-shadow-sm"
                >
                  <textPath
                    href="#stickerBottomArc"
                    startOffset="50%"
                    textAnchor="middle"
                  >
                    MENÜYÜ GÖRÜNTÜLEYİN
                  </textPath>
                </text>

                {/* 3 Gold Accent Dots ••• */}
                <g transform="translate(180, 312)">
                  <circle cx="-14" cy="0" r="3" fill="url(#stickerGoldGrad)" />
                  <circle cx="0" cy="0" r="3.8" fill="url(#stickerGoldGrad)" />
                  <circle cx="14" cy="0" r="3" fill="url(#stickerGoldGrad)" />
                </g>

                {/* Micro Footer Tag */}
                <text
                  x="180"
                  y="336"
                  textAnchor="middle"
                  fill={isWhite ? 'rgba(0,0,0,0.38)' : 'rgba(255,255,255,0.38)'}
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
                {locale === 'tr' ? 'Ø 65mm Lazer Pleksi Akrilik & 3M VHB' : 'Ø 65mm Laser Acrylic & 3M VHB'}
              </h4>
              <p className="text-xs text-white/50">
                {isWhite
                  ? (locale === 'tr' ? 'Kristal Beyaz Akrilik • IP68 Sıvı Geçirmez' : 'Crystal White Acrylic • IP68 Waterproof')
                  : (locale === 'tr' ? 'Obsidyen Siyah Akrilik • IP68 Sıvı Geçirmez' : 'Obsidian Black Acrylic • IP68 Waterproof')}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-white/50 block font-semibold">{locale === 'tr' ? 'Birim Fiyat' : 'Unit Price'}</span>
              <span className="text-base font-black text-amber-400">175 TL / adet</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT: LIVE CUSTOMIZER & QUANTITY CALCULATOR ── */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-6">
          {/* Color Switcher Card */}
          <div className="rounded-3xl border border-white/10 bg-neutral-900/80 backdrop-blur-xl p-6 shadow-2xl space-y-4">
            <h4 className="text-sm font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Palette className="w-4 h-4 text-amber-400" />
              <span>{locale === 'tr' ? 'Masa Stickerı Rengi' : 'Table Sticker Color'}</span>
            </h4>

            {/* Color Switcher: Siyah Akrilik vs Beyaz Akrilik */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setStickerColor('black')}
                className={`p-3.5 rounded-2xl border text-left text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                  stickerColor === 'black'
                    ? 'border-amber-500 bg-amber-500/15 text-white ring-2 ring-amber-500/40 shadow-lg shadow-amber-500/10'
                    : 'border-white/10 bg-white/[0.03] text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="w-4 h-4 rounded-full border border-neutral-700 bg-neutral-950 shrink-0 shadow-inner" />
                <div className="truncate">
                  <span className="block font-bold">{locale === 'tr' ? 'Siyah Akrilik' : 'Black Acrylic'}</span>
                </div>
                {stickerColor === 'black' && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 ml-auto shrink-0" />}
              </button>

              <button
                type="button"
                onClick={() => setStickerColor('white')}
                className={`p-3.5 rounded-2xl border text-left text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                  stickerColor === 'white'
                    ? 'border-amber-500 bg-amber-500/15 text-white ring-2 ring-amber-500/40 shadow-lg shadow-amber-500/10'
                    : 'border-white/10 bg-white/[0.03] text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="w-4 h-4 rounded-full border border-slate-300 bg-white shrink-0 shadow-sm" />
                <div className="truncate">
                  <span className="block font-bold">{locale === 'tr' ? 'Beyaz Akrilik' : 'White Acrylic'}</span>
                </div>
                {stickerColor === 'white' && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 ml-auto shrink-0" />}
              </button>
            </div>

            {/* Feature specs list */}
            <div className="pt-2 space-y-2 text-xs text-white/70">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.02] border border-white/5">
                <Layers className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{locale === 'tr' ? '2mm Lazer Kesim Pleksi Akrilik Gövde' : '2mm Laser Cut Plexi Acrylic Body'}</span>
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

          {/* Quantity Selector & Live Subtotal Calculator Card */}
          <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-b from-neutral-900/90 via-neutral-900/70 to-neutral-950 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black uppercase tracking-wider text-amber-400">
                {locale === 'tr' ? 'Adet Seçimi & Fiyat Hesaplayıcı' : 'Quantity & Live Subtotal'}
              </h4>
              <span className="text-[11px] font-bold text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                175 TL / adet
              </span>
            </div>

            {/* Preset Buttons: 10x, 25x, 50x */}
            <div className="grid grid-cols-3 gap-2">
              {[10, 25, 50].map((qty) => (
                <button
                  key={qty}
                  type="button"
                  onClick={() => setStickerQuantity(qty)}
                  className={`py-2.5 px-3 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${
                    stickerQuantity === qty
                      ? 'border-amber-500 bg-amber-500 text-black font-black shadow-md shadow-amber-500/25'
                      : 'border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <div>{qty}x Adet</div>
                  <div
                    className={`text-[10px] mt-0.5 ${
                      stickerQuantity === qty ? 'text-black/80 font-bold' : 'text-amber-400'
                    }`}
                  >
                    {(qty * 175).toLocaleString('tr-TR')} TL
                  </div>
                </button>
              ))}
            </div>

            {/* Stepper for Custom Quantities (Min. 10) */}
            <div className="flex items-center justify-between bg-neutral-950 border border-white/10 rounded-2xl p-2.5">
              <span className="text-xs font-bold text-white/70 ml-2">
                {locale === 'tr' ? 'Özel Adet (Min. 10):' : 'Custom Quantity (Min 10):'}
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStickerQuantity((prev) => Math.max(10, prev - 5))}
                  className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-base font-black text-white min-w-[32px] text-center font-mono">
                  {stickerQuantity}
                </span>
                <button
                  type="button"
                  onClick={() => setStickerQuantity((prev) => prev + 5)}
                  className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Live Subtotal Display & CTA */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <div>
                <div className="text-xs text-white/50 font-semibold">
                  {locale === 'tr' ? 'Hesaplanan Tutar' : 'Subtotal'}
                </div>
                <div className="text-2xl font-black text-amber-400">
                  {stickerSubtotal.toLocaleString('tr-TR')} TL
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
