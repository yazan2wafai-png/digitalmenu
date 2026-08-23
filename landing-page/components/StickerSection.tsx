'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Palette,
  CheckCircle2,
  Plus,
  Minus,
  ArrowUpRight,
  ShieldCheck,
  Smartphone,
  QrCode,
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
  const [stickerPattern, setStickerPattern] = useState<1 | 2 | 3>(1);
  const [stickerVenueName, setStickerVenueName] = useState<string>('THE CAFE');
  const [stickerTableNumber, setStickerTableNumber] = useState<string>('MASA 12');
  const [stickerCurvedText, setStickerCurvedText] = useState<string>(
    'Menü için qr veya nfc okutabilirsiniz'
  );
  const [stickerQuantity, setStickerQuantity] = useState<number>(10);
  const [woodTheme, setWoodTheme] = useState<'walnut' | 'oak'>('walnut');

  const t = translations[locale];
  const stickerSubtotal = stickerQuantity * 175;

  return (
    <section
      id="sticker"
      className="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-white/5 scroll-mt-20"
    >
      {/* ── SECTION HEADER ── */}
      <div className="text-center space-y-3 mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold tracking-wider uppercase backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{t.sticker.badge}</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
          {locale === 'tr' ? 'Akrilik Masa Stickerı ' : 'Acrylic Table Sticker '}
          <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
            (NFC + QR)
          </span>
        </h2>
        <p className="text-sm sm:text-base text-white/60 max-w-2xl mx-auto leading-relaxed">
          {t.sticker.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* ── LEFT: REALISTIC ACRYLIC STICKER MOCKUP ON WOOD ── */}
        <div
          className={`lg:col-span-7 relative min-h-[490px] sm:min-h-[540px] rounded-3xl border border-white/10 overflow-hidden p-6 sm:p-8 shadow-2xl flex flex-col justify-between transition-colors duration-500 ${
            woodTheme === 'walnut'
              ? 'bg-gradient-to-br from-[#1e1109] via-[#140a04] to-[#0a0502]'
              : 'bg-gradient-to-br from-[#2a1b10] via-[#1f140b] to-[#120b06]'
          }`}
        >
          {/* Wood Grain Texture & Radial Studio Lighting */}
          <div
            className="absolute inset-0 opacity-40 pointer-events-none mix-blend-overlay"
            style={{
              backgroundImage: `repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 2px, transparent 2px, transparent 10px), radial-gradient(circle at 50% 40%, rgba(245,158,11,0.22), transparent 75%)`,
            }}
          />

          {/* Top Bar: Wood Surface Switcher & Badges */}
          <div className="relative z-20 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold tracking-wider uppercase px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {locale === 'tr' ? '🌳 Masif Ahşap Masa' : '🌳 Solid Wood Mockup'}
              </span>
              <span className="text-[11px] font-black px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border border-amber-500/40">
                {t.sticker.unitPrice}
              </span>
            </div>

            {/* Wood Switcher */}
            <div className="flex items-center gap-1.5 bg-black/50 p-1 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => setWoodTheme('walnut')}
                className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                  woodTheme === 'walnut'
                    ? 'bg-amber-500 text-black font-black'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Ceviz
              </button>
              <button
                type="button"
                onClick={() => setWoodTheme('oak')}
                className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                  woodTheme === 'oak'
                    ? 'bg-amber-500 text-black font-black'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Meşe
              </button>
            </div>
          </div>

          {/* Center Realistic Circular Acrylic Sticker Disc */}
          <div className="relative my-auto flex items-center justify-center py-6">
            {/* Ambient Drop Shadow on Wood */}
            <div className="absolute w-64 h-64 sm:w-72 sm:h-72 rounded-full bg-black/90 blur-2xl pointer-events-none transform translate-y-6" />

            {/* 2mm Acrylic Disc Body */}
            <motion.div
              key={`${stickerPattern}-${stickerVenueName}-${stickerTableNumber}-${stickerCurvedText}`}
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 22, stiffness: 280 }}
              className="relative w-64 h-64 sm:w-76 sm:h-76 aspect-square rounded-full border-4 border-amber-400/90 bg-gradient-to-b from-[#18181f] via-[#101014] to-[#070709] shadow-2xl flex items-center justify-center select-none ring-2 ring-amber-400/50 group cursor-pointer overflow-hidden"
            >
              {/* Glossy Acrylic Diagonal Clearcoat Reflection */}
              <div
                className="absolute inset-0 pointer-events-none rounded-full"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.05) 38%, transparent 58%, rgba(255,255,255,0.12) 100%)',
                }}
              />

              {/* ── SVG HIGH PRECISION VECTOR GRAPHIC (MATCHES EXACT PHOTO) ── */}
              <svg
                viewBox="0 0 320 320"
                className="w-full h-full p-2 relative z-10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* Arc Path for Curved Text (Upper Arc) */}
                  <path
                    id="topTextArc"
                    d="M 36,160 A 124,124 0 1,1 284,160"
                    fill="none"
                  />
                  {/* Arc Path for Curved Text (Lower Arc) */}
                  <path
                    id="bottomTextArc"
                    d="M 38,160 A 122,122 0 0,0 282,160"
                    fill="none"
                  />

                  {/* Golden Metallic Gradient */}
                  <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fde047" />
                    <stop offset="50%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#d97706" />
                  </linearGradient>

                  <linearGradient id="goldGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.8" />
                  </linearGradient>
                </defs>

                {/* Outer Delicate Gold Rim Circle */}
                <circle
                  cx="160"
                  cy="160"
                  r="148"
                  stroke="url(#goldGrad)"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                />

                {/* Inner Precision Hairline Ring */}
                <circle
                  cx="160"
                  cy="160"
                  r="138"
                  stroke="rgba(251, 191, 36, 0.4)"
                  strokeWidth="1.2"
                />

                {/* ── 1. TOP VENUE LOGO SLOT ── */}
                <g transform="translate(160, 48)">
                  {/* Crown / Star Logo Emblem */}
                  <path
                    d="M -14,-8 L -7,-2 L 0,-10 L 7,-2 L 14,-8 L 11,2 L -11,2 Z"
                    fill="url(#goldGrad)"
                  />
                  {/* Venue Name */}
                  <text
                    y="18"
                    textAnchor="middle"
                    fill="#fde047"
                    fontSize="13"
                    fontWeight="900"
                    letterSpacing="3.5"
                    className="uppercase font-sans"
                  >
                    {stickerVenueName || 'THE CAFE'}
                  </text>
                </g>

                {/* ── 2. ARCHED CURVED TEXT: "Menü için qr veya nfc okutabilirsiniz" ── */}
                <text
                  fontSize="9.2"
                  fontWeight="700"
                  fill="#ffffff"
                  letterSpacing="1.2"
                  className="uppercase tracking-widest font-sans drop-shadow-sm"
                >
                  <textPath
                    href="#topTextArc"
                    startOffset="50%"
                    textAnchor="middle"
                  >
                    {stickerCurvedText || 'Menü için qr veya nfc okutabilirsiniz'}
                  </textPath>
                </text>

                {/* ── 3. CONCENTRIC ARC LINES AROUND CENTRAL QR CODE ── */}
                {/* Left Concentric NFC Waves */}
                <g stroke="#fbbf24" strokeWidth="2.2" strokeLinecap="round" opacity="0.85">
                  <path d="M 88,132 A 40,40 0 0,0 88,188" />
                  <path d="M 74,122 A 56,56 0 0,0 74,198" strokeWidth="1.8" opacity="0.65" />
                  <path d="M 60,112 A 72,72 0 0,0 60,208" strokeWidth="1.4" opacity="0.45" />
                </g>

                {/* Right Concentric NFC Waves */}
                <g stroke="#fbbf24" strokeWidth="2.2" strokeLinecap="round" opacity="0.85">
                  <path d="M 232,132 A 40,40 0 0,1 232,188" />
                  <path d="M 246,122 A 56,56 0 0,1 246,198" strokeWidth="1.8" opacity="0.65" />
                  <path d="M 260,112 A 72,72 0 0,1 260,208" strokeWidth="1.4" opacity="0.45" />
                </g>

                {/* ── 4. DUAL SMARTPHONE TAP GESTURE ICONS ON SIDES ── */}
                {/* Left Smartphone */}
                <g transform="translate(42, 160) rotate(14)">
                  {/* Phone Body */}
                  <rect
                    x="-10"
                    y="-18"
                    width="20"
                    height="36"
                    rx="4"
                    fill="#15151c"
                    stroke="#fbbf24"
                    strokeWidth="1.8"
                  />
                  {/* Screen */}
                  <rect
                    x="-7"
                    y="-13"
                    width="14"
                    height="26"
                    rx="2"
                    fill="#0d0d10"
                  />
                  {/* NFC Wave on phone top */}
                  <path
                    d="M 12,-6 A 8,8 0 0,1 12,6"
                    stroke="#f59e0b"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M 16,-10 A 14,14 0 0,1 16,10"
                    stroke="#fde047"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                </g>

                {/* Right Smartphone */}
                <g transform="translate(278, 160) rotate(-14)">
                  <rect
                    x="-10"
                    y="-18"
                    width="20"
                    height="36"
                    rx="4"
                    fill="#15151c"
                    stroke="#fbbf24"
                    strokeWidth="1.8"
                  />
                  <rect
                    x="-7"
                    y="-13"
                    width="14"
                    height="26"
                    rx="2"
                    fill="#0d0d10"
                  />
                  <path
                    d="M -12,-6 A 8,8 0 0,0 -12,6"
                    stroke="#f59e0b"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M -16,-10 A 14,14 0 0,0 -16,10"
                    stroke="#fde047"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                </g>

                {/* ── 5. CENTRAL QR CODE CONTAINER CARD ── */}
                <g transform="translate(160, 160)">
                  {/* White QR Background Box with Gold Border */}
                  <rect
                    x="-46"
                    y="-46"
                    width="92"
                    height="92"
                    rx="14"
                    fill="#ffffff"
                    stroke="url(#goldGrad)"
                    strokeWidth="3.2"
                  />

                  {/* Scannable Crisp QR Code Matrix */}
                  {/* Top-Left Finder */}
                  <rect x="-36" y="-36" width="24" height="24" fill="#0a0a0c" rx="4" />
                  <rect x="-32" y="-32" width="16" height="16" fill="#ffffff" rx="2" />
                  <rect x="-28" y="-28" width="8" height="8" fill="#0a0a0c" rx="1.5" />

                  {/* Top-Right Finder */}
                  <rect x="12" y="-36" width="24" height="24" fill="#0a0a0c" rx="4" />
                  <rect x="16" y="-32" width="16" height="16" fill="#ffffff" rx="2" />
                  <rect x="20" y="-28" width="8" height="8" fill="#0a0a0c" rx="1.5" />

                  {/* Bottom-Left Finder */}
                  <rect x="-36" y="12" width="24" height="24" fill="#0a0a0c" rx="4" />
                  <rect x="-32" y="16" width="16" height="16" fill="#ffffff" rx="2" />
                  <rect x="-28" y="20" width="8" height="8" fill="#0a0a0c" rx="1.5" />

                  {/* Data Modules */}
                  <rect x="-6" y="-36" width="4" height="4" fill="#0a0a0c" />
                  <rect x="2" y="-36" width="4" height="4" fill="#0a0a0c" />
                  <rect x="-6" y="-28" width="4" height="4" fill="#0a0a0c" />
                  <rect x="-36" y="-6" width="4" height="4" fill="#0a0a0c" />
                  <rect x="-28" y="-6" width="4" height="4" fill="#0a0a0c" />
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
                  <circle cx="0" cy="0" r="10" fill="#ffffff" stroke="#f59e0b" strokeWidth="1.5" />
                  <text
                    x="0"
                    y="3"
                    textAnchor="middle"
                    fill="#0a0a0c"
                    fontSize="7"
                    fontWeight="900"
                  >
                    NFC
                  </text>
                </g>

                {/* ── 6. BOTTOM TABLE NUMBER BADGE ── */}
                <g transform="translate(160, 260)">
                  {/* Table Badge Pill */}
                  <rect
                    x="-55"
                    y="-14"
                    width="110"
                    height="28"
                    rx="14"
                    fill="#15151c"
                    stroke="url(#goldGrad)"
                    strokeWidth="1.8"
                  />
                  <text
                    y="4"
                    textAnchor="middle"
                    fill="#fde047"
                    fontSize="11.5"
                    fontWeight="900"
                    letterSpacing="2"
                    className="font-mono uppercase"
                  >
                    {stickerTableNumber || 'MASA 12'}
                  </text>
                </g>

                {/* Bottom Micro Tag */}
                <text
                  x="160"
                  y="298"
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.4)"
                  fontSize="7.5"
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
                {locale === 'tr' ? 'IP68 Sıvı Geçirmez, solmaz UV baskı' : 'IP68 Waterproof, UV-resistant print'}
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
          {/* Customizer Card */}
          <div className="rounded-3xl border border-white/10 bg-neutral-900/80 backdrop-blur-xl p-6 shadow-2xl space-y-4">
            <h4 className="text-sm font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Palette className="w-4 h-4 text-amber-400" />
              <span>{locale === 'tr' ? 'Masa Stickerı Kişiselleştirme' : 'Table Sticker Customizer'}</span>
            </h4>

            {/* Venue Name Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-white/70 block">
                {locale === 'tr' ? 'Mekan Adı / Logo Başlığı' : 'Venue Name / Logo'}
              </label>
              <input
                type="text"
                value={stickerVenueName}
                onChange={(e) => setStickerVenueName(e.target.value)}
                placeholder="THE CAFE"
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500 transition-all font-bold uppercase tracking-wider"
              />
            </div>

            {/* Table Number Badge Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-white/70 block">
                {locale === 'tr' ? 'Masa Numarası Rozeti' : 'Table Number Badge'}
              </label>
              <input
                type="text"
                value={stickerTableNumber}
                onChange={(e) => setStickerTableNumber(e.target.value)}
                placeholder="MASA 12"
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500 transition-all font-mono font-bold uppercase"
              />
            </div>

            {/* Arched Curved Text Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-white/70 block">
                {locale === 'tr' ? 'Kavisli Kenar Yazısı' : 'Arched Curved Border Text'}
              </label>
              <input
                type="text"
                value={stickerCurvedText}
                onChange={(e) => setStickerCurvedText(e.target.value)}
                placeholder="Menü için qr veya nfc okutabilirsiniz"
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500 transition-all font-semibold"
              />
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
