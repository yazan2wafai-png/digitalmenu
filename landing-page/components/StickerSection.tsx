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
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
          {locale === 'tr' ? 'Premium Akrilik Masa Stickerı ' : 'Premium Acrylic Table Sticker '}
          <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
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
                {locale === 'tr' ? '🏷️ Akrilik Hibrit Donanım' : '🏷️ Acrylic Hybrid Hardware'}
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
            <div className="absolute w-64 h-64 sm:w-76 sm:h-76 rounded-full bg-black/80 blur-2xl pointer-events-none transform translate-y-6" />

            {/* 2mm Acrylic Disc Body with Glass Edge Bevels */}
            <motion.div
              key={stickerColor}
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 22, stiffness: 280 }}
              className={`relative w-64 h-64 sm:w-76 sm:h-76 aspect-square rounded-full border-4 shadow-2xl flex items-center justify-center select-none group cursor-pointer overflow-hidden ${
                isWhite
                  ? 'border-amber-400/80 bg-gradient-to-b from-[#ffffff] via-[#f8fafc] to-[#e2e8f0] ring-2 ring-amber-400/40'
                  : 'border-amber-400/90 bg-gradient-to-b from-[#18181f] via-[#101014] to-[#070709] ring-2 ring-amber-400/50'
              }`}
            >
              {/* Glossy Acrylic Diagonal Clearcoat Reflection */}
              <div
                className="absolute inset-0 pointer-events-none rounded-full"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.06) 38%, transparent 58%, rgba(255,255,255,0.15) 100%)',
                }}
              />

              {/* Polished Glass Outer Bevel Rim */}
              <div
                className="absolute inset-1 rounded-full pointer-events-none border"
                style={{
                  borderColor: isWhite ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.15)',
                }}
              />

              {/* ── SVG HIGH PRECISION VECTOR GRAPHIC (IMAGE 2 EXACT SPEC) ── */}
              <svg
                viewBox="0 0 320 320"
                className="w-full h-full p-2.5 relative z-10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* Arc Path for Bottom Curved Text "MENÜYÜ GÖRÜNTÜLEYİN" */}
                  <path
                    id="stickerBottomArc"
                    d="M 38,160 A 122,122 0 0,0 282,160"
                    fill="none"
                  />

                  {/* Golden Metallic Gradient */}
                  <linearGradient id="stickerGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fde047" />
                    <stop offset="50%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#d97706" />
                  </linearGradient>

                  <linearGradient id="stickerGoldGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.8" />
                  </linearGradient>
                </defs>

                {/* Outer Delicate Gold Rim Circle */}
                <circle
                  cx="160"
                  cy="160"
                  r="148"
                  stroke="url(#stickerGoldGrad)"
                  strokeWidth="2.2"
                />

                {/* Inner Precision Hairline Ring */}
                <circle
                  cx="160"
                  cy="160"
                  r="140"
                  stroke="rgba(251, 191, 36, 0.45)"
                  strokeWidth="1.2"
                />

                {/* ── 1. HEADER: CROSSED FORK & KNIFE EMBLEM + "MENU" + "— TARAYIN —" ── */}
                <g transform="translate(160, 44)">
                  {/* Crossed Fork & Knife (🍴) Emblem */}
                  <g transform="translate(0, 0)">
                    {/* Fork (Left to Right crossing) */}
                    <g transform="rotate(-30)">
                      {/* Fork Handle */}
                      <path
                        d="M 0,2 L 0,16"
                        stroke="url(#stickerGoldGrad)"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                      {/* Fork Base */}
                      <path
                        d="M -4,-2 C -4,2 4,2 4,-2"
                        stroke="url(#stickerGoldGrad)"
                        strokeWidth="1.4"
                        fill="none"
                      />
                      {/* 3 Prongs */}
                      <line x1="-3.5" y1="-2" x2="-3.5" y2="-9" stroke="url(#stickerGoldGrad)" strokeWidth="1.2" strokeLinecap="round" />
                      <line x1="0" y1="-2" x2="0" y2="-10" stroke="url(#stickerGoldGrad)" strokeWidth="1.2" strokeLinecap="round" />
                      <line x1="3.5" y1="-2" x2="3.5" y2="-9" stroke="url(#stickerGoldGrad)" strokeWidth="1.2" strokeLinecap="round" />
                    </g>

                    {/* Knife (Right to Left crossing) */}
                    <g transform="rotate(30)">
                      {/* Knife Handle */}
                      <path
                        d="M 0,2 L 0,16"
                        stroke="url(#stickerGoldGrad)"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                      {/* Knife Blade */}
                      <path
                        d="M 0,2 L 0,-10 C 0,-10 4.5,-7 4.5,-2 C 4.5,2 0,2 0,2 Z"
                        fill="url(#stickerGoldGrad)"
                      />
                    </g>
                  </g>

                  {/* "MENU" Typography */}
                  <text
                    y="27"
                    textAnchor="middle"
                    fill="url(#stickerGoldGrad)"
                    fontSize="16"
                    fontWeight="900"
                    letterSpacing="3.5"
                    className="uppercase font-sans"
                  >
                    MENU
                  </text>

                  {/* Sub-line: "— TARAYIN —" */}
                  <text
                    y="39"
                    textAnchor="middle"
                    fill={isWhite ? '#b45309' : '#fbbf24'}
                    fontSize="8.5"
                    fontWeight="800"
                    letterSpacing="2"
                    className="uppercase font-sans opacity-90"
                  >
                    — TARAYIN —
                  </text>
                </g>

                {/* ── 2. SIDES: GOLD CONCENTRIC NFC RADAR ARCS ((( ))) ── */}
                {/* Left Concentric Radar Arcs */}
                <g stroke="url(#stickerGoldGrad)" strokeWidth="2.4" strokeLinecap="round" opacity="0.9">
                  <path d="M 88,136 A 36,36 0 0,0 88,184" />
                  <path d="M 74,124 A 52,52 0 0,0 74,196" strokeWidth="2.0" opacity="0.7" />
                  <path d="M 60,112 A 68,68 0 0,0 60,208" strokeWidth="1.5" opacity="0.45" />
                </g>

                {/* Right Concentric Radar Arcs */}
                <g stroke="url(#stickerGoldGrad)" strokeWidth="2.4" strokeLinecap="round" opacity="0.9">
                  <path d="M 232,136 A 36,36 0 0,1 232,184" />
                  <path d="M 246,124 A 52,52 0 0,1 246,196" strokeWidth="2.0" opacity="0.7" />
                  <path d="M 260,112 A 68,68 0 0,1 260,208" strokeWidth="1.5" opacity="0.45" />
                </g>

                {/* ── 3. CENTER: SQUARE QR MATRIX WITH DOUBLE ROUNDED CORNER BRACKETS [ QR ] ── */}
                <g transform="translate(160, 160)">
                  {/* Outer Corner Brackets [ ] */}
                  <g stroke="url(#stickerGoldGrad)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none">
                    {/* Top-Left Bracket */}
                    <path d="M -54,-38 L -54,-50 A 6,6 0 0,1 -48,-56 L -36,-56" />
                    {/* Top-Right Bracket */}
                    <path d="M 36,-56 L 48,-56 A 6,6 0 0,1 54,-50 L 54,-38" />
                    {/* Bottom-Left Bracket */}
                    <path d="M -54,38 L -54,50 A 6,6 0 0,0 -48,56 L -36,56" />
                    {/* Bottom-Right Bracket */}
                    <path d="M 36,56 L 48,56 A 6,6 0 0,0 54,50 L 54,38" />
                  </g>

                  {/* Inner Fine Corner Brackets */}
                  <g stroke="rgba(251, 191, 36, 0.5)" strokeWidth="1.2" strokeLinecap="round" fill="none">
                    <path d="M -48,-36 L -48,-46 A 3,3 0 0,1 -45,-49 L -35,-49" />
                    <path d="M 35,-49 L 45,-49 A 3,3 0 0,1 48,-46 L 48,-36" />
                    <path d="M -48,36 L -48,46 A 3,3 0 0,0 -45,49 L -35,49" />
                    <path d="M 35,49 L 45,49 A 3,3 0 0,0 48,46 L 48,36" />
                  </g>

                  {/* QR Background Card */}
                  <rect
                    x="-42"
                    y="-42"
                    width="84"
                    height="84"
                    rx="12"
                    fill="#ffffff"
                    stroke="url(#stickerGoldGrad)"
                    strokeWidth="2.2"
                  />

                  {/* Scannable Crisp QR Code Matrix */}
                  {/* Top-Left Finder */}
                  <rect x="-34" y="-34" width="22" height="22" fill="#0a0a0c" rx="3.5" />
                  <rect x="-30" y="-30" width="14" height="14" fill="#ffffff" rx="2" />
                  <rect x="-27" y="-27" width="8" height="8" fill="#0a0a0c" rx="1.5" />

                  {/* Top-Right Finder */}
                  <rect x="12" y="-34" width="22" height="22" fill="#0a0a0c" rx="3.5" />
                  <rect x="16" y="-30" width="14" height="14" fill="#ffffff" rx="2" />
                  <rect x="19" y="-27" width="8" height="8" fill="#0a0a0c" rx="1.5" />

                  {/* Bottom-Left Finder */}
                  <rect x="-34" y="12" width="22" height="22" fill="#0a0a0c" rx="3.5" />
                  <rect x="-30" y="16" width="14" height="14" fill="#ffffff" rx="2" />
                  <rect x="-27" y="19" width="8" height="8" fill="#0a0a0c" rx="1.5" />

                  {/* QR Data Cells */}
                  <rect x="-6" y="-34" width="4" height="4" fill="#0a0a0c" />
                  <rect x="2" y="-34" width="4" height="4" fill="#0a0a0c" />
                  <rect x="-6" y="-26" width="4" height="4" fill="#0a0a0c" />
                  <rect x="-34" y="-6" width="4" height="4" fill="#0a0a0c" />
                  <rect x="-26" y="-6" width="4" height="4" fill="#0a0a0c" />
                  <rect x="20" y="-6" width="4" height="4" fill="#0a0a0c" />
                  <rect x="28" y="-6" width="4" height="4" fill="#0a0a0c" />
                  <rect x="-6" y="20" width="4" height="4" fill="#0a0a0c" />
                  <rect x="2" y="28" width="4" height="4" fill="#0a0a0c" />
                  <rect x="12" y="12" width="4" height="4" fill="#0a0a0c" />
                  <rect x="20" y="20" width="4" height="4" fill="#0a0a0c" />
                  <rect x="28" y="28" width="4" height="4" fill="#0a0a0c" />
                  <rect x="28" y="12" width="4" height="4" fill="#0a0a0c" />
                  <rect x="12" y="28" width="4" height="4" fill="#0a0a0c" />

                  {/* Center Mini NFC Badge */}
                  <circle cx="0" cy="0" r="9" fill="#ffffff" stroke="#f59e0b" strokeWidth="1.5" />
                  <text
                    x="0"
                    y="3"
                    textAnchor="middle"
                    fill="#0a0a0c"
                    fontSize="6.5"
                    fontWeight="900"
                  >
                    NFC
                  </text>
                </g>

                {/* ── 4. BOTTOM: CURVED SUBTEXT "MENÜYÜ GÖRÜNTÜLEYİN" + 3 GOLD ACCENT DOTS ── */}
                <text
                  fontSize="10"
                  fontWeight="800"
                  fill={isWhite ? '#1e293b' : '#ffffff'}
                  letterSpacing="2.2"
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
                <g transform="translate(160, 276)">
                  <circle cx="-12" cy="0" r="2.8" fill="url(#stickerGoldGrad)" />
                  <circle cx="0" cy="0" r="3.4" fill="url(#stickerGoldGrad)" />
                  <circle cx="12" cy="0" r="2.8" fill="url(#stickerGoldGrad)" />
                </g>

                {/* Micro Footer Tag */}
                <text
                  x="160"
                  y="298"
                  textAnchor="middle"
                  fill={isWhite ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.35)'}
                  fontSize="7"
                  fontWeight="600"
                  letterSpacing="1"
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
