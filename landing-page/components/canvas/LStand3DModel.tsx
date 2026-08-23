'use client';
import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export type StandMaterialType = 'walnut' | 'oak' | 'black' | 'crystal' | 'white';
export type StandTemplate = 'templateA' | 'templateB';

export interface LStandModelProps {
  white?: boolean;
  logoText?: string;
  businessName?: string;
  qrText?: string;
  showStars?: boolean;
  material?: StandMaterialType | string;
  isHovered?: boolean;
  branding?: boolean;
  template?: StandTemplate;
}

/**
 * Draws the official multicolored Google logo wordmark (Google)
 */
function drawGoogleWordmark(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  fontSize: number = 72
) {
  ctx.save();
  ctx.font = `800 ${fontSize}px "Product Sans", "Google Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  ctx.textBaseline = 'middle';

  const letters = [
    { char: 'G', color: '#4285F4' },
    { char: 'o', color: '#EA4335' },
    { char: 'o', color: '#FBBC05' },
    { char: 'g', color: '#4285F4' },
    { char: 'l', color: '#34A853' },
    { char: 'e', color: '#EA4335' },
  ];

  let totalWidth = 0;
  const widths = letters.map((item) => {
    const w = ctx.measureText(item.char).width;
    totalWidth += w;
    return w;
  });

  let currentX = cx - totalWidth / 2;
  letters.forEach((item, idx) => {
    ctx.fillStyle = item.color;
    ctx.textAlign = 'left';
    ctx.fillText(item.char, currentX, cy);
    currentX += widths[idx];
  });

  ctx.restore();
}

/**
 * Draws Google'da with official colors + suffix
 */
function drawGoogleDa(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  fontSize: number = 68,
  suffixColor: string = '#ffffff'
) {
  ctx.save();
  ctx.font = `800 ${fontSize}px "Product Sans", "Google Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  ctx.textBaseline = 'middle';

  const letters = [
    { char: 'G', color: '#4285F4' },
    { char: 'o', color: '#EA4335' },
    { char: 'o', color: '#FBBC05' },
    { char: 'g', color: '#4285F4' },
    { char: 'l', color: '#34A853' },
    { char: 'e', color: '#EA4335' },
    { char: "'da", color: suffixColor },
  ];

  let totalWidth = 0;
  const widths = letters.map((item) => {
    const w = ctx.measureText(item.char).width;
    totalWidth += w;
    return w;
  });

  let currentX = cx - totalWidth / 2;
  letters.forEach((item, idx) => {
    ctx.fillStyle = item.color;
    ctx.textAlign = 'left';
    ctx.fillText(item.char, currentX, cy);
    currentX += widths[idx];
  });

  ctx.restore();
}

/**
 * Draws the official Google 'G' icon badge
 */
function drawGoogleGIcon(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) {
  ctx.save();
  const radius = size / 2;
  const lineWidth = radius * 0.42;
  const midRadius = radius - lineWidth / 2;

  ctx.beginPath();
  ctx.arc(cx, cy, radius + 2, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();

  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'butt';

  // 1. Red Top Arc
  ctx.strokeStyle = '#EA4335';
  ctx.beginPath();
  ctx.arc(cx, cy, midRadius, Math.PI * 1.05, Math.PI * 1.78);
  ctx.stroke();

  // 2. Blue Top-Right Quadrant
  ctx.strokeStyle = '#4285F4';
  ctx.beginPath();
  ctx.arc(cx, cy, midRadius, Math.PI * 1.78, Math.PI * 2.05);
  ctx.stroke();

  // 3. Green Bottom Arc
  ctx.strokeStyle = '#34A853';
  ctx.beginPath();
  ctx.arc(cx, cy, midRadius, Math.PI * 0.0, Math.PI * 0.65);
  ctx.stroke();

  // 4. Yellow Left Arc
  ctx.strokeStyle = '#FBBC05';
  ctx.beginPath();
  ctx.arc(cx, cy, midRadius, Math.PI * 0.65, Math.PI * 1.05);
  ctx.stroke();

  // 5. Blue Horizontal Inset Bar
  ctx.fillStyle = '#4285F4';
  const barHeight = lineWidth;
  const barWidth = radius * 0.95;
  ctx.fillRect(cx - 2, cy - barHeight / 2, barWidth, barHeight);

  ctx.restore();
}

/**
 * Draws 4-Color Accent Line
 */
function draw4ColorAccentLine(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  totalWidth: number,
  height: number = 6
) {
  ctx.save();
  const startX = cx - totalWidth / 2;
  const segmentWidth = totalWidth / 4;
  const colors = ['#4285F4', '#EA4335', '#FBBC05', '#34A853'];

  colors.forEach((color, i) => {
    ctx.fillStyle = color;
    const sx = startX + i * segmentWidth;
    ctx.beginPath();
    if (i === 0) {
      ctx.roundRect(sx, cy - height / 2, segmentWidth + 1, height, [height / 2, 0, 0, height / 2]);
    } else if (i === 3) {
      ctx.roundRect(sx, cy - height / 2, segmentWidth + 1, height, [0, height / 2, height / 2, 0]);
    } else {
      ctx.rect(sx, cy - height / 2, segmentWidth + 1, height);
    }
    ctx.fill();
  });
  ctx.restore();
}

/**
 * Draws 5-pointed star with gold metallic gradient
 */
function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  spikes: number,
  outerRadius: number,
  innerRadius: number
) {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  const grad = ctx.createLinearGradient(cx, cy - outerRadius, cx, cy + outerRadius);
  grad.addColorStop(0, '#fde047');
  grad.addColorStop(0.5, '#f59e0b');
  grad.addColorStop(1, '#d97706');

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 1.2;
  ctx.stroke();
}

/**
 * Rounded rectangle helper
 */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * Draws QR Matrix pattern helper
 */
function drawQRMatrix(
  ctx: CanvasRenderingContext2D,
  qrBoxX: number,
  qrBoxY: number,
  qrBoxSize: number,
  qrText: string,
  qrModuleColor: string = '#0a0a0c',
  qrBgColor: string = '#ffffff'
) {
  roundRect(ctx, qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 20);
  ctx.fillStyle = qrBgColor;
  ctx.fill();
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 3.5;
  ctx.stroke();

  const qrPadding = 20;
  const qrInnerX = qrBoxX + qrPadding;
  const qrInnerY = qrBoxY + qrPadding;
  const qrInnerSize = qrBoxSize - qrPadding * 2;
  const moduleCount = 25;
  const cellSize = qrInnerSize / moduleCount;

  let hash = 0;
  for (let i = 0; i < qrText.length; i++) {
    hash = (hash << 5) - hash + qrText.charCodeAt(i);
    hash |= 0;
  }

  const drawFinder = (fx: number, fy: number) => {
    ctx.fillStyle = qrModuleColor;
    ctx.fillRect(fx, fy, cellSize * 7, cellSize * 7);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(fx + cellSize, fy + cellSize, cellSize * 5, cellSize * 5);
    ctx.fillStyle = qrModuleColor;
    ctx.fillRect(fx + cellSize * 2, fy + cellSize * 2, cellSize * 3, cellSize * 3);
  };

  drawFinder(qrInnerX, qrInnerY);
  drawFinder(qrInnerX + (moduleCount - 7) * cellSize, qrInnerY);
  drawFinder(qrInnerX, qrInnerY + (moduleCount - 7) * cellSize);

  ctx.fillStyle = qrModuleColor;
  for (let r = 0; r < moduleCount; r++) {
    for (let c = 0; c < moduleCount; c++) {
      if (r < 8 && c < 8) continue;
      if (r < 8 && c >= moduleCount - 8) continue;
      if (r >= moduleCount - 8 && c < 8) continue;
      if (r >= 9 && r <= 15 && c >= 9 && c <= 15) continue;

      const seed = Math.sin(r * 29.3 + c * 19.7 + hash) * 10000;
      if (seed - Math.floor(seed) > 0.48) {
        ctx.fillRect(qrInnerX + c * cellSize, qrInnerY + r * cellSize, cellSize * 0.96, cellSize * 0.96);
      }
    }
  }

  // Mini Google 'G' in center
  const qrLogoSize = cellSize * 5.5;
  const qrLogoCenterX = qrInnerX + qrInnerSize / 2;
  const qrLogoCenterY = qrInnerY + qrInnerSize / 2;
  roundRect(ctx, qrLogoCenterX - qrLogoSize / 2, qrLogoCenterY - qrLogoSize / 2, qrLogoSize, qrLogoSize, 8);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  drawGoogleGIcon(ctx, qrLogoCenterX, qrLogoCenterY, qrLogoSize * 0.75);
}

/**
 * ─────────────────────────────────────────────────────────────
 * MASTER DECAL GENERATOR:
 * Supports TEMPLATE A (doremusic / Turkish Google Değerlendirme) & TEMPLATE B (Google Classic)
 * ─────────────────────────────────────────────────────────────
 */
function createLStandDecal(
  template: StandTemplate,
  isWhite: boolean,
  logoText: string,
  businessName: string,
  qrText: string,
  showStars: boolean,
  branding: boolean = true
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1440;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const primaryText = isWhite ? '#0f172a' : '#ffffff';
  const secondaryText = isWhite ? '#475569' : '#cbd5e1';
  const accentGold = '#f59e0b';

  // Card Acrylic Background
  roundRect(ctx, 24, 24, canvas.width - 48, canvas.height - 48, 40);
  if (isWhite) {
    ctx.fillStyle = '#f8f9fa';
    ctx.fill();
    ctx.strokeStyle = 'rgba(203, 213, 225, 0.85)';
    ctx.lineWidth = 4;
    ctx.stroke();
  } else {
    ctx.fillStyle = '#0d0d0e';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 4;
    ctx.stroke();
  }

  // ═════════════════════════════════════════════════════════════
  // TEMPLATE A: DOREMUSIC / TURKISH GOOGLE DEĞERLENDİRME STYLE
  // ═════════════════════════════════════════════════════════════
  if (template === 'templateA') {
    // 1. TOP BRAND / VENUE LOGO
    const topBrandText = logoText || 'doremusic';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Stylish Brand Header Pill
    roundRect(ctx, 512 - 240, 70, 480, 64, 32);
    ctx.fillStyle = isWhite ? '#0f172a' : 'rgba(251, 191, 36, 0.12)';
    ctx.fill();
    ctx.strokeStyle = accentGold;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.font = '900 32px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = isWhite ? '#ffffff' : '#fbbf24';
    ctx.letterSpacing = '2px';
    ctx.fillText(topBrandText, 512, 102);

    // 2. MAIN TITLE: "Google'da bizi değerlendirin"
    drawGoogleDa(ctx, 512, 185, 62, primaryText);

    ctx.font = '800 42px "Google Sans", "Product Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = primaryText;
    ctx.letterSpacing = '0.5px';
    ctx.fillText('bizi değerlendirin', 512, 245);

    // 5 Gold Stars (Under Title)
    if (showStars) {
      const starY = 305;
      const starSpacing = 42;
      const startX = 512 - 2 * starSpacing;
      for (let i = 0; i < 5; i++) {
        drawStar(ctx, startX + i * starSpacing, starY, 5, 17, 8);
      }
    }

    // 4-Color Accent Line
    draw4ColorAccentLine(ctx, 512, 355, 540, 6);

    // 3. MIDDLE SECTION: QR CODE (LEFT) + CIRCULAR NFC BADGE (RIGHT)
    const midRowY = 590;

    // ── LEFT: QR Code Box ──
    const qrCenterX = 295;
    const qrSize = 250;
    const qrX = qrCenterX - qrSize / 2;
    const qrY = midRowY - qrSize / 2;

    // Header above QR
    ctx.font = '900 26px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = primaryText;
    ctx.textAlign = 'center';
    ctx.fillText('KODU TARAYIN', qrCenterX, qrY - 26);

    drawQRMatrix(ctx, qrX, qrY, qrSize, qrText);

    ctx.font = '600 16px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillStyle = secondaryText;
    ctx.fillText('Kamera ile okutunuz', qrCenterX, qrY + qrSize + 28);

    // ── CENTER VEYA / OR BADGE ──
    ctx.beginPath();
    ctx.arc(512, midRowY, 28, 0, Math.PI * 2);
    ctx.fillStyle = isWhite ? '#e2e8f0' : '#1e1e24';
    ctx.fill();
    ctx.strokeStyle = accentGold;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.font = '900 16px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillStyle = accentGold;
    ctx.textAlign = 'center';
    ctx.fillText('VEYA', 512, midRowY);

    // ── RIGHT: Circular NFC Badge ──
    const nfcCenterX = 729;
    const nfcCenterY = midRowY;
    const nfcRadius = 120;

    ctx.font = '900 26px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = primaryText;
    ctx.textAlign = 'center';
    ctx.fillText('YAKLAŞTIRIN', nfcCenterX, qrY - 26);

    // Circular NFC Disc
    ctx.beginPath();
    ctx.arc(nfcCenterX, nfcCenterY, nfcRadius, 0, Math.PI * 2);
    ctx.fillStyle = isWhite ? '#0f172a' : '#15151c';
    ctx.fill();
    ctx.strokeStyle = accentGold;
    ctx.lineWidth = 4;
    ctx.stroke();

    // Concentric Gold Wave Arcs
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 4.5;
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.arc(nfcCenterX, nfcCenterY, 32, -Math.PI * 0.75, Math.PI * 0.75);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(nfcCenterX, nfcCenterY, 58, -Math.PI * 0.75, Math.PI * 0.75);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(nfcCenterX, nfcCenterY, 84, -Math.PI * 0.75, Math.PI * 0.75);
    ctx.stroke();

    // Center NFC Text Badge
    ctx.beginPath();
    ctx.arc(nfcCenterX, nfcCenterY, 26, 0, Math.PI * 2);
    ctx.fillStyle = '#f59e0b';
    ctx.fill();

    ctx.font = '900 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = '#0a0a0c';
    ctx.textAlign = 'center';
    ctx.fillText('NFC', nfcCenterX, nfcCenterY + 1);

    ctx.font = '600 16px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillStyle = secondaryText;
    ctx.fillText('Telefonu yaklaştırınız', nfcCenterX, qrY + qrSize + 28);

    // 4. BOTTOM INSTRUCTION TEXT CARD (Turkish doremusic Style)
    const instructCardY = 875;
    const instructCardW = 860;
    const instructCardH = 145;
    const instructCardX = 512 - instructCardW / 2;

    roundRect(ctx, instructCardX, instructCardY, instructCardW, instructCardH, 26);
    ctx.fillStyle = isWhite ? 'rgba(15, 23, 42, 0.05)' : 'rgba(251, 191, 36, 0.08)';
    ctx.fill();
    ctx.strokeStyle = isWhite ? 'rgba(15, 23, 42, 0.15)' : 'rgba(251, 191, 36, 0.4)';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Sparkle Icons (✦ ✨)
    ctx.font = '700 26px -apple-system, sans-serif';
    ctx.fillStyle = accentGold;
    ctx.fillText('✦', instructCardX + 45, instructCardY + 45);
    ctx.fillText('✨', instructCardX + instructCardW - 45, instructCardY + instructCardH - 40);

    // Instruction Lines
    ctx.font = '800 25px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = primaryText;
    ctx.textAlign = 'center';
    ctx.fillText(
      'Kodu tarayın veya telefonunuzu yaklaştırınız',
      512,
      instructCardY + 52
    );

    ctx.font = '700 23px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = isWhite ? '#b45309' : '#fbbf24';
    ctx.fillText(
      've ne düşündüğünüzü bize söyleyin.',
      512,
      instructCardY + 98
    );

    // 5. FOOTER: BUSINESS NAME & POWERED BY
    const footerY = 1070;
    if (businessName) {
      roundRect(ctx, 512 - 280, footerY, 560, 56, 28);
      ctx.fillStyle = isWhite ? '#f1f5f9' : '#18181c';
      ctx.fill();
      ctx.strokeStyle = isWhite ? '#cbd5e1' : 'rgba(255,255,255,0.12)';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      ctx.font = '700 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = isWhite ? '#334155' : '#e2e8f0';
      ctx.textAlign = 'center';
      ctx.fillText(businessName, 512, footerY + 28);
    }

    // Micro Tagline
    ctx.font = '600 15px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillStyle = isWhite ? '#94a3b8' : '#71717a';
    ctx.textAlign = 'center';
    ctx.fillText('⚡ Powered by NFCMyPlace® • Temassız Google Yorum Standı', 512, 1370);

    return canvas;
  }

  // ═════════════════════════════════════════════════════════════
  // TEMPLATE B: GOOGLE CLASSIC MINIMALIST STYLE
  // ═════════════════════════════════════════════════════════════
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '700 36px "Google Sans", "Product Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = primaryText;
  ctx.fillText('Review us on', 512, 105);

  drawGoogleWordmark(ctx, 512, 175, 78);

  if (showStars) {
    const starY = 250;
    const starSpacing = 44;
    const startX = 512 - 2 * starSpacing;
    for (let i = 0; i < 5; i++) {
      drawStar(ctx, startX + i * starSpacing, starY, 5, 18, 8.5);
    }
  }

  draw4ColorAccentLine(ctx, 512, 305, 580, 7);

  // Middle Row: TAP ME | OR | SCAN QR
  const midRowY = 560;
  const tapCenterX = 280;

  const phoneW = 76;
  const phoneH = 120;
  const phoneX = tapCenterX - phoneW / 2;
  const phoneY = midRowY - 110;

  roundRect(ctx, phoneX, phoneY, phoneW, phoneH, 16);
  ctx.fillStyle = isWhite ? '#0f172a' : '#1e1e24';
  ctx.fill();
  ctx.strokeStyle = accentGold;
  ctx.lineWidth = 4;
  ctx.stroke();

  roundRect(ctx, phoneX + 8, phoneY + 12, phoneW - 16, phoneH - 24, 8);
  ctx.fillStyle = isWhite ? '#ffffff' : '#0d0d10';
  ctx.fill();

  ctx.strokeStyle = accentGold;
  ctx.lineWidth = 3.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(tapCenterX, phoneY - 12, 18, -Math.PI * 0.75, -Math.PI * 0.25);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(tapCenterX, phoneY - 12, 32, -Math.PI * 0.75, -Math.PI * 0.25);
  ctx.stroke();

  ctx.font = '900 36px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = primaryText;
  ctx.textAlign = 'center';
  ctx.fillText('TAP ME', tapCenterX, midRowY + 50);

  ctx.font = '600 18px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillStyle = secondaryText;
  ctx.fillText('Touch phone here', tapCenterX, midRowY + 86);

  // OR badge
  ctx.beginPath();
  ctx.arc(512, midRowY, 32, 0, Math.PI * 2);
  ctx.fillStyle = isWhite ? '#e2e8f0' : '#1e1e24';
  ctx.fill();
  ctx.strokeStyle = accentGold;
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.font = '900 22px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillStyle = accentGold;
  ctx.textAlign = 'center';
  ctx.fillText('OR', 512, midRowY);

  // SCAN QR
  const qrCenterX = 744;
  const qrBoxSize = 250;
  const qrBoxX = qrCenterX - qrBoxSize / 2;
  const qrBoxY = midRowY - 145;

  ctx.font = '900 34px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = primaryText;
  ctx.textAlign = 'center';
  ctx.fillText('SCAN QR', qrCenterX, qrBoxY - 26);

  drawQRMatrix(ctx, qrBoxX, qrBoxY, qrBoxSize, qrText);

  ctx.font = '600 16px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillStyle = secondaryText;
  ctx.textAlign = 'center';
  ctx.fillText('Use camera to scan', qrCenterX, qrBoxY + qrBoxSize + 28);

  // Divider
  ctx.strokeStyle = isWhite ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.1)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(90, 890);
  ctx.lineTo(934, 890);
  ctx.stroke();

  // Footer Branding Pills
  const footerX = 90;
  const footerY = 940;
  const pillWidth = 560;

  roundRect(ctx, footerX, footerY, pillWidth, 74, 37);
  ctx.fillStyle = isWhite ? '#0f172a' : 'rgba(251, 191, 36, 0.12)';
  ctx.fill();
  ctx.strokeStyle = accentGold;
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.font = '900 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = isWhite ? '#ffffff' : '#fbbf24';
  ctx.textAlign = 'center';
  ctx.fillText(logoText || 'Your Logo', footerX + pillWidth / 2, footerY + 37);

  const subPillY = footerY + 92;
  roundRect(ctx, footerX, subPillY, pillWidth, 68, 34);
  ctx.fillStyle = isWhite ? '#f1f5f9' : '#18181c';
  ctx.fill();
  ctx.strokeStyle = isWhite ? '#cbd5e1' : 'rgba(255,255,255,0.14)';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.font = '700 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = isWhite ? '#334155' : '#e2e8f0';
  ctx.textAlign = 'center';
  ctx.fillText(businessName || 'Business Name (Optional)', footerX + pillWidth / 2, subPillY + 34);

  ctx.font = '600 16px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillStyle = isWhite ? '#94a3b8' : '#71717a';
  ctx.textAlign = 'left';
  ctx.fillText('⚡ Powered by NFCMyPlace', footerX + 12, subPillY + 104);

  // Bottom-Right Contactless Wave Icon
  const nfcCircleX = 810;
  const nfcCircleY = footerY + 76;
  const nfcRadius = 58;

  ctx.beginPath();
  ctx.arc(nfcCircleX, nfcCircleY, nfcRadius, 0, Math.PI * 2);
  ctx.fillStyle = isWhite ? '#0f172a' : '#141418';
  ctx.fill();
  ctx.strokeStyle = accentGold;
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';

  ctx.beginPath();
  ctx.arc(nfcCircleX - 8, nfcCircleY, 14, -Math.PI / 2.6, Math.PI / 2.6);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(nfcCircleX - 8, nfcCircleY, 26, -Math.PI / 2.6, Math.PI / 2.6);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(nfcCircleX - 8, nfcCircleY, 38, -Math.PI / 2.6, Math.PI / 2.6);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(nfcCircleX - 10, nfcCircleY, 5, 0, Math.PI * 2);
  ctx.fillStyle = '#fbbf24';
  ctx.fill();

  return canvas;
}

export function LStand3DModel({
  white = false,
  logoText = 'doremusic',
  businessName = 'doremusic Akasya AVM',
  qrText = 'g.page/r/doremusic',
  showStars = true,
  material = 'crystal',
  isHovered = false,
  branding = true,
  template = 'templateA',
}: LStandModelProps) {
  const pulseRingRef = useRef<THREE.Mesh>(null);
  const pulseRing2Ref = useRef<THREE.Mesh>(null);

  const isWhite = white || material === 'crystal' || material === 'white';

  // Generate decal canvas texture
  const decalTexture = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const canvas = createLStandDecal(template, isWhite, logoText, businessName, qrText, showStars, branding);
    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 16;
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.needsUpdate = true;
    return texture;
  }, [template, isWhite, logoText, businessName, qrText, showStars, branding]);

  useEffect(() => {
    if (decalTexture) {
      decalTexture.needsUpdate = true;
    }
  }, [decalTexture]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (pulseRingRef.current) {
      pulseRingRef.current.scale.setScalar(1 + Math.sin(t * 3.5) * 0.08);
    }
    if (pulseRing2Ref.current) {
      pulseRing2Ref.current.scale.setScalar(1 + Math.cos(t * 3.5) * 0.06);
    }
  });

  // 15° inclination angle for ergonomic 75° viewing angle
  const tiltAngle = (15 * Math.PI) / 180;

  // Exact Physical Dimension Geometry:
  // Base: width 2.5, depth 1.4, thickness 0.08, flat on floor extending backwards from front edge (z = +0.4)
  // Upright Face: width 2.48, height 3.5, thickness 0.08, tilted backwards by 15° directly starting from (y = -1.46, z = +0.4)
  const standWidth = 2.5;
  const baseDepth = 1.4;
  const faceHeight = 3.5;
  const acrylicThickness = 0.08;
  const frontEdgeZ = 0.4;
  const baseY = -1.5;
  const baseTopY = baseY + acrylicThickness / 2; // -1.46

  // Upright face center position so its bottom edge meets (0, baseTopY, frontEdgeZ)
  const faceCenterY = baseTopY + (faceHeight / 2) * Math.cos(tiltAngle); // ~0.230
  const faceCenterZ = frontEdgeZ - (faceHeight / 2) * Math.sin(tiltAngle); // ~-0.053

  return (
    <group position={[0, -0.25, 0]}>
      {/* ──────────────────────────────────────────────────────────
          1. MONOLITHIC ACRYLIC L-STAND RESTING FOOT (EXTENDS BACKWARDS)
          ────────────────────────────────────────────────────────── */}
      <group position={[0, baseY, frontEdgeZ - baseDepth / 2]}>
        {/* Flat Bottom Resting Foot */}
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[standWidth, acrylicThickness, baseDepth]} />
          {isWhite ? (
            <meshPhysicalMaterial
              color="#f8f9fa"
              transmission={0.92}
              opacity={0.96}
              transparent
              roughness={0.06}
              ior={1.5}
              thickness={1.2}
              clearcoat={1.0}
              clearcoatRoughness={0.05}
              specularIntensity={1.0}
              specularColor="#ffffff"
            />
          ) : (
            <meshPhysicalMaterial
              color="#0d0d0e"
              roughness={0.18}
              metalness={0.2}
              clearcoat={0.65}
              clearcoatRoughness={0.08}
              specularIntensity={0.8}
            />
          )}
        </mesh>

        {/* Front Edge Bevel Glow Line */}
        <mesh position={[0, acrylicThickness / 2, baseDepth / 2 - 0.01]}>
          <boxGeometry args={[standWidth - 0.04, 0.015, 0.015]} />
          <meshStandardMaterial
            color={isWhite ? '#38bdf8' : '#f59e0b'}
            metalness={0.9}
            roughness={0.1}
            emissive={isWhite ? '#38bdf8' : '#d97706'}
            emissiveIntensity={0.35}
          />
        </mesh>

        {/* Non-Slip Silicone Resting Bumpers */}
        {[-1.05, 1.05].flatMap((x) =>
          [-0.5, 0.5].map((z, i) => (
            <mesh key={`${x}-${z}-${i}`} position={[x, -acrylicThickness / 2 - 0.01, z]}>
              <cylinderGeometry args={[0.06, 0.06, 0.02, 16]} />
              <meshStandardMaterial color="#111111" roughness={0.9} />
            </mesh>
          ))
        )}
      </group>

      {/* ──────────────────────────────────────────────────────────
          2. SEAMLESS THERMO-BENT ACRYLIC ROUNDED FRONT CORNER
          ────────────────────────────────────────────────────────── */}
      <mesh position={[0, baseTopY, frontEdgeZ]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[acrylicThickness / 2, acrylicThickness / 2, standWidth, 16]} />
        <meshPhysicalMaterial
          color={isWhite ? '#f8f9fa' : '#0d0d0e'}
          roughness={0.08}
          transmission={isWhite ? 0.92 : 0}
          clearcoat={1}
          clearcoatRoughness={0.05}
        />
      </mesh>

      {/* ──────────────────────────────────────────────────────────
          3. SEAMLESS 75° ANGLED VERTICAL FRONT ACRYLIC FACE
          ────────────────────────────────────────────────────────── */}
      <group position={[0, faceCenterY, faceCenterZ]} rotation={[-tiltAngle, 0, 0]}>
        {/* Monolithic Acrylic Slab Body */}
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[standWidth, faceHeight, acrylicThickness]} />
          {isWhite ? (
            <meshPhysicalMaterial
              color="#f8f9fa"
              transmission={0.94}
              opacity={0.98}
              transparent
              roughness={0.04}
              ior={1.52}
              thickness={1.2}
              clearcoat={1.0}
              clearcoatRoughness={0.05}
              specularIntensity={1.0}
              specularColor="#ffffff"
            />
          ) : (
            <meshPhysicalMaterial
              color="#0d0d0e"
              roughness={0.18}
              metalness={0.2}
              clearcoat={0.6}
              clearcoatRoughness={0.1}
              specularIntensity={0.8}
            />
          )}
        </mesh>

        {/* Polished Glass Edge Wire Highlight */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[standWidth + 0.01, faceHeight + 0.01, acrylicThickness]} />
          <meshStandardMaterial
            color={isWhite ? '#bae6fd' : '#f59e0b'}
            transparent
            opacity={isWhite ? 0.25 : 0.15}
            wireframe
          />
        </mesh>

        {/* ────────────────────────────────────────────────────────
            4. HIGH-RESOLUTION DYNAMIC DECAL FRONT MESH
            ──────────────────────────────────────────────────────── */}
        {decalTexture && (
          <mesh position={[0, 0, acrylicThickness / 2 + 0.002]}>
            <planeGeometry args={[standWidth - 0.08, faceHeight - 0.08]} />
            <meshStandardMaterial
              map={decalTexture}
              transparent
              roughness={0.15}
              metalness={0.05}
              polygonOffset
              polygonOffsetFactor={-1}
            />
          </mesh>
        )}

        {/* ────────────────────────────────────────────────────────
            5. 3D GOLD FOIL PULSING NFC EMISSION RINGS
            ──────────────────────────────────────────────────────── */}
        <group
          position={
            template === 'templateA'
              ? [0.55, -0.22, acrylicThickness / 2 + 0.006] // Over right-side NFC badge
              : [0.72, -1.2, acrylicThickness / 2 + 0.006] // Over bottom-right corner badge
          }
        >
          <mesh ref={pulseRingRef}>
            <torusGeometry args={[0.18, 0.008, 16, 32]} />
            <meshStandardMaterial
              color="#fbbf24"
              metalness={0.9}
              roughness={0.1}
              transparent
              opacity={0.6}
              emissive="#f59e0b"
              emissiveIntensity={0.5}
            />
          </mesh>
          <mesh ref={pulseRing2Ref}>
            <torusGeometry args={[0.24, 0.005, 16, 32]} />
            <meshStandardMaterial
              color="#fef08a"
              metalness={0.8}
              roughness={0.2}
              transparent
              opacity={0.35}
              emissive="#eab308"
              emissiveIntensity={0.4}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
}

export default LStand3DModel;
