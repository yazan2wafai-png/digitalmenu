'use client';

import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, ContactShadows, Environment, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

export type StandMaterialType = 'walnut' | 'oak' | 'black' | 'crystal' | 'white';
export type StandTemplate = 'templateA' | 'templateB';

export interface Stand3DProps {
  white?: boolean;
  branding?: boolean;
  qrText?: string;
  logoText?: string;
  businessName?: string;
  showStars?: boolean;
  material?: StandMaterialType | string;
  template?: StandTemplate;
  autoRotate?: boolean;
  className?: string;
}

/**
 * Rounded rectangle path helper
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
 * Creates rich linear gold gradient
 */
function createGoldGradient(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number
) {
  const grad = ctx.createLinearGradient(x1, y1, x2, y2);
  grad.addColorStop(0, '#fef08a');
  grad.addColorStop(0.25, '#e5c158');
  grad.addColorStop(0.65, '#d4af37');
  grad.addColorStop(1, '#aa7c11');
  return grad;
}

/**
 * Draws the official Google 'G' icon badge in vector
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

  // 2. Blue Top-Right Arc
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
  const barWidth = radius * 0.96;
  ctx.fillRect(cx - 2, cy - barHeight / 2, barWidth, barHeight);

  ctx.restore();
}

/**
 * Draws Google'da bizi with official Google brand colors + suffix
 */
function drawGoogleDaBizi(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  fontSize: number = 100,
  suffixColor: string = '#ffffff'
) {
  ctx.save();
  ctx.font = `800 ${fontSize}px "Google Sans", "Product Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  ctx.textBaseline = 'middle';

  const letters = [
    { char: 'G', color: '#4285F4' },
    { char: 'o', color: '#EA4335' },
    { char: 'o', color: '#FBBC05' },
    { char: 'g', color: '#4285F4' },
    { char: 'l', color: '#34A853' },
    { char: 'e', color: '#EA4335' },
    { char: "'da bizi", color: suffixColor },
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
 * Draws 4-Color Accent Line
 */
function draw4ColorAccentLine(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  totalWidth: number,
  height: number = 10
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
  spikes: number = 5,
  outerRadius: number = 40,
  innerRadius: number = 19
) {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  const grad = ctx.createLinearGradient(cx, cy - outerRadius, cx, cy + outerRadius);
  grad.addColorStop(0, '#fef08a');
  grad.addColorStop(0.3, '#e5c158');
  grad.addColorStop(0.7, '#d4af37');
  grad.addColorStop(1, '#aa7c11');

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

  ctx.strokeStyle = '#92400e';
  ctx.lineWidth = 2.2;
  ctx.stroke();
}

/**
 * Draws Gold Musical Note Emblem (♫) + "doremusic" Typography
 */
function drawMusicNoteAndBrand(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  brandText: string = 'doremusic',
  isWhite: boolean = false
) {
  ctx.save();
  const goldGrad = createGoldGradient(ctx, cx - 350, cy, cx + 350, cy);

  ctx.font = '800 86px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif';
  const textWidth = ctx.measureText(brandText).width;
  const noteW = 80;
  const gap = 32;
  const totalW = noteW + gap + textWidth;
  const startX = cx - totalW / 2;

  // Vector double-beamed musical note (♫)
  const noteX = startX + 32;
  const noteY = cy;

  ctx.fillStyle = goldGrad;
  ctx.strokeStyle = goldGrad;
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Left note head (tilted ellipse)
  ctx.beginPath();
  ctx.ellipse(noteX - 22, noteY + 14, 18, 13, -Math.PI / 6, 0, Math.PI * 2);
  ctx.fill();

  // Right note head (tilted ellipse)
  ctx.beginPath();
  ctx.ellipse(noteX + 22, noteY + 6, 18, 13, -Math.PI / 6, 0, Math.PI * 2);
  ctx.fill();

  // Left stem
  ctx.beginPath();
  ctx.moveTo(noteX - 10, noteY + 11);
  ctx.lineTo(noteX - 10, noteY - 30);
  ctx.stroke();

  // Right stem
  ctx.beginPath();
  ctx.moveTo(noteX + 34, noteY + 3);
  ctx.lineTo(noteX + 34, noteY - 38);
  ctx.stroke();

  // Top connecting double beam
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(noteX - 11, noteY - 26);
  ctx.lineTo(noteX + 35, noteY - 34);
  ctx.stroke();

  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(noteX - 11, noteY - 11);
  ctx.lineTo(noteX + 35, noteY - 19);
  ctx.stroke();

  // Brand Typography in Gold
  ctx.fillStyle = goldGrad;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(brandText, startX + noteW + gap, cy - 2);

  ctx.restore();
}

/**
 * Draws Gold Smartphone NFC Tap Icon with Wireless Wave Emission Lines
 */
function drawSmartphoneNFCIcon(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  isWhite: boolean
) {
  ctx.save();
  const primaryGold = '#e5c158';
  const lightGold = '#fef08a';
  const goldGrad = createGoldGradient(ctx, cx - 100, cy - 100, cx + 100, cy + 100);

  // Phone body
  const phoneW = 96;
  const phoneH = 156;
  const phoneX = cx - phoneW / 2;
  const phoneY = cy - phoneH / 2;

  roundRect(ctx, phoneX, phoneY, phoneW, phoneH, 22);
  ctx.fillStyle = isWhite ? '#ffffff' : '#121316';
  ctx.fill();
  ctx.strokeStyle = goldGrad;
  ctx.lineWidth = 6;
  ctx.stroke();

  // Phone screen inner
  roundRect(ctx, phoneX + 8, phoneY + 14, phoneW - 16, phoneH - 32, 12);
  ctx.fillStyle = isWhite ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.06)';
  ctx.fill();

  // Phone speaker notch
  ctx.beginPath();
  ctx.moveTo(cx - 16, phoneY + 7);
  ctx.lineTo(cx + 16, phoneY + 7);
  ctx.strokeStyle = primaryGold;
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Phone NFC circular badge inside screen
  ctx.beginPath();
  ctx.arc(cx, cy - 2, 22, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(229, 193, 88, 0.18)';
  ctx.fill();
  ctx.strokeStyle = primaryGold;
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.font = '900 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = primaryGold;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('NFC', cx, cy - 2);

  // Wireless wave emission arcs above the phone
  ctx.strokeStyle = lightGold;
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';

  // Wave 1 (Inner Arc)
  ctx.beginPath();
  ctx.arc(cx, phoneY - 10, 32, -Math.PI * 0.75, -Math.PI * 0.25);
  ctx.stroke();

  // Wave 2 (Mid Arc)
  ctx.beginPath();
  ctx.arc(cx, phoneY - 10, 58, -Math.PI * 0.75, -Math.PI * 0.25);
  ctx.stroke();

  // Wave 3 (Outer Arc)
  ctx.strokeStyle = 'rgba(229, 193, 88, 0.6)';
  ctx.beginPath();
  ctx.arc(cx, phoneY - 10, 84, -Math.PI * 0.75, -Math.PI * 0.25);
  ctx.stroke();

  // Side waves left & right
  ctx.strokeStyle = primaryGold;
  ctx.lineWidth = 5;
  // Left wave
  ctx.beginPath();
  ctx.arc(phoneX - 8, cy, 36, Math.PI * 0.7, Math.PI * 1.3);
  ctx.stroke();
  // Right wave
  ctx.beginPath();
  ctx.arc(phoneX + phoneW + 8, cy, 36, -Math.PI * 0.3, Math.PI * 0.3);
  ctx.stroke();

  ctx.restore();
}

/**
 * QR Code pattern drawing helper with clean Gold Border Box & Google 'G' in center
 * Sized to fill 45% of stand width (920px on 2048px canvas)
 */
function drawQRMatrixWithGoldBox(
  ctx: CanvasRenderingContext2D,
  qrBoxX: number,
  qrBoxY: number,
  qrBoxSize: number,
  qrText: string,
  isWhite: boolean
) {
  const qrPadding = 48;
  const qrInnerX = qrBoxX + qrPadding;
  const qrInnerY = qrBoxY + qrPadding;
  const qrInnerSize = qrBoxSize - qrPadding * 2;
  const moduleCount = 29;
  const cellSize = qrInnerSize / moduleCount;

  // Background Box with Gold Border
  roundRect(ctx, qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 48);
  ctx.fillStyle = '#ffffff';
  ctx.fill();

  const goldGrad = createGoldGradient(ctx, qrBoxX, qrBoxY, qrBoxX + qrBoxSize, qrBoxY + qrBoxSize);
  ctx.strokeStyle = goldGrad;
  ctx.lineWidth = 8;
  ctx.stroke();

  // Inner subtle gold hairline
  roundRect(ctx, qrBoxX + 10, qrBoxY + 10, qrBoxSize - 20, qrBoxSize - 20, 40);
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  let hash = 0;
  for (let i = 0; i < qrText.length; i++) {
    hash = (hash << 5) - hash + qrText.charCodeAt(i);
    hash |= 0;
  }

  const qrModuleColor = '#0a0a0c';

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
      if (r >= 11 && r <= 17 && c >= 11 && c <= 17) continue;

      const seed = Math.sin(r * 29.3 + c * 19.7 + hash) * 10000;
      if (seed - Math.floor(seed) > 0.46) {
        ctx.fillRect(qrInnerX + c * cellSize, qrInnerY + r * cellSize, cellSize * 0.98, cellSize * 0.98);
      }
    }
  }

  // Centered Google 'G' icon badge in the middle of QR code
  const qrLogoSize = cellSize * 6.6;
  const qrLogoCenterX = qrInnerX + qrInnerSize / 2;
  const qrLogoCenterY = qrInnerY + qrInnerSize / 2;
  roundRect(ctx, qrLogoCenterX - qrLogoSize / 2, qrLogoCenterY - qrLogoSize / 2, qrLogoSize, qrLogoSize, 20);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 3;
  ctx.stroke();

  drawGoogleGIcon(ctx, qrLogoCenterX, qrLogoCenterY, qrLogoSize * 0.78);
}

/**
 * FULL-BLEED 2048x3072 VECTOR CANVAS TEXTURE GENERATOR FOR STAND3D
 * Direct UV Print Physics: Transparent alpha background shining directly over acrylic
 */
function createLStandDecalTexture(
  template: StandTemplate,
  isWhite: boolean,
  branding: boolean,
  logoText: string,
  businessName: string,
  qrText: string,
  showStars: boolean
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 3072;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // Direct UV Print Physics: Clear transparent canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const primaryText = isWhite ? '#111827' : '#ffffff';
  const accentGold = '#d4af37';

  // ═════════════════════════════════════════════════════════════
  // 1. ELEGANT GOLDEN DOUBLE BORDER WITH UNIFORM 8% INSET PADDING
  // ═════════════════════════════════════════════════════════════
  const insetX = Math.round(canvas.width * 0.08); // 164px
  const insetY = Math.round(canvas.height * 0.08); // 246px
  const outerW = canvas.width - insetX * 2; // 1720px
  const outerH = canvas.height - insetY * 2; // 2580px

  // Outer Golden Inset Line
  roundRect(ctx, insetX, insetY, outerW, outerH, 52);
  const borderGrad = createGoldGradient(ctx, insetX, insetY, insetX + outerW, insetY + outerH);
  ctx.strokeStyle = borderGrad;
  ctx.lineWidth = 5.0;
  ctx.stroke();

  // Inner Inset Hairline (22px gap)
  const gap = 22;
  roundRect(ctx, insetX + gap, insetY + gap, outerW - gap * 2, outerH - gap * 2, 38);
  ctx.strokeStyle = isWhite ? 'rgba(180, 83, 9, 0.45)' : 'rgba(229, 193, 88, 0.45)';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // ═════════════════════════════════════════════════════════════
  // 2. TOP: GOLD MUSICAL NOTE EMBLEM (♫) + "doremusic" TYPOGRAPHY
  // ═════════════════════════════════════════════════════════════
  const topBrandText = logoText || 'doremusic';
  drawMusicNoteAndBrand(ctx, 1024, 395, topBrandText, isWhite);

  // ═════════════════════════════════════════════════════════════
  // 3. MAIN HEADING: MULTICOLORED "Google'da bizi" + BOLD "değerlendirin"
  // ═════════════════════════════════════════════════════════════
  drawGoogleDaBizi(ctx, 1024, 570, 100, primaryText);

  ctx.font = '800 88px "Google Sans", "Product Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = primaryText;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('değerlendirin', 1024, 680);

  // 4-Color Accent Line
  draw4ColorAccentLine(ctx, 1024, 755, 920, 10);

  // ═════════════════════════════════════════════════════════════
  // 4. CENTER: LARGE 45% WIDTH SQUARE QR CODE WITH GOLD ACCENTS & GOOGLE 'G'
  // ═════════════════════════════════════════════════════════════
  const qrBoxSize = 920; // Exactly 45% of stand width (920px on 2048px canvas)
  const qrBoxX = 1024 - qrBoxSize / 2;
  const qrBoxY = 825;

  drawQRMatrixWithGoldBox(ctx, qrBoxX, qrBoxY, qrBoxSize, qrText, isWhite);

  // ═════════════════════════════════════════════════════════════
  // 5. SUB-ELEMENT: GOLD SMARTPHONE NFC TAP ICON & INSTRUCTION LINE
  // ═════════════════════════════════════════════════════════════
  const nfcRowY = 1930;
  drawSmartphoneNFCIcon(ctx, 1024, nfcRowY, isWhite);

  ctx.font = '800 32px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = isWhite ? '#b45309' : '#e5c158';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('TEMASSIZ DOKUNUŞ VEYA QR TARAMA', 1024, 2060);

  // ═════════════════════════════════════════════════════════════
  // 6. INSTRUCTION CARD: "Kodu tarayın veya telefonunuzu yaklaştırınız ve ne düşündüğünüzü bize söyleyin."
  // ═════════════════════════════════════════════════════════════
  const cardW = 1600;
  const cardH = 180;
  const cardX = 1024 - cardW / 2;
  const cardY = 2120;

  roundRect(ctx, cardX, cardY, cardW, cardH, 32);
  ctx.fillStyle = isWhite ? 'rgba(17, 24, 39, 0.04)' : 'rgba(229, 193, 88, 0.07)';
  ctx.fill();
  ctx.strokeStyle = isWhite ? 'rgba(17, 24, 39, 0.12)' : 'rgba(229, 193, 88, 0.35)';
  ctx.lineWidth = 3.2;
  ctx.stroke();

  // Sparkling star accents
  ctx.font = '700 36px -apple-system, sans-serif';
  ctx.fillStyle = accentGold;
  ctx.fillText('✦', cardX + 50, cardY + cardH / 2);
  ctx.fillText('✨', cardX + cardW - 50, cardY + cardH / 2);

  // Instruction Line 1
  ctx.font = '800 42px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = primaryText;
  ctx.textAlign = 'center';
  ctx.fillText('Kodu tarayın veya telefonunuzu yaklaştırınız', 1024, cardY + 62);

  // Instruction Line 2
  ctx.font = '700 38px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = isWhite ? '#b45309' : '#e5c158';
  ctx.fillText('ve ne düşündüğünüzü bize söyleyin.', 1024, cardY + 122);

  // ═════════════════════════════════════════════════════════════
  // 7. BOTTOM FOOTER: 5 PROMINENT SOLID GOLDEN STARS ⭐⭐⭐⭐⭐
  // ═════════════════════════════════════════════════════════════
  if (showStars) {
    const starCenterY = 2460;
    const starSpacing = 110;
    const starStartX = 1024 - 2 * starSpacing;
    for (let i = 0; i < 5; i++) {
      drawStar(ctx, starStartX + i * starSpacing, starCenterY, 5, 40, 19);
    }
  }

  // ═════════════════════════════════════════════════════════════
  // 8. BOTTOM TAGLINE FOOTER WITH GOOGLE 'G' BADGE
  // ═════════════════════════════════════════════════════════════
  const gIconY = 2610;
  drawGoogleGIcon(ctx, 1024, gIconY, 72);

  ctx.font = '600 28px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillStyle = isWhite ? '#64748b' : 'rgba(255, 255, 255, 0.65)';
  ctx.textAlign = 'center';
  ctx.fillText('⚡ Powered by NFCMyPlace® • Temassız Google Yorum Standı', 1024, 2735);

  return canvas;
}

/**
 * Monolithic L-Stand 3D Model:
 * Exact physical alignment:
 * - Base foot rests flat on table (y = -1.5, extending backwards from z = +0.4 to z = -1.0)
 * - Upright tilted face starts directly from front edge of base foot (y = -1.46, z = +0.4)
 * - Tilted backward by 15° (75° elevation angle)
 * - Proportioned to exact 10cm x 15cm stand dimensions (2.5 : 3.75)
 */
function StandMesh({
  white = false,
  branding = true,
  qrText = 'g.page/r/doremusic',
  logoText = 'doremusic',
  businessName = 'doremusic Akasya AVM',
  showStars = true,
  template = 'templateA',
  autoRotate = true,
}: Stand3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const pulseRingRef = useRef<THREE.Mesh>(null);
  const pulseRing2Ref = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const { pointer } = useThree();

  const isWhite = Boolean(white);

  // Exact Physical Dimension Ratios (10cm × 15cm):
  const standWidth = 2.5;
  const faceHeight = 3.75;
  const baseDepth = 1.4;
  const acrylicThickness = 0.08;
  const frontEdgeZ = 0.4;
  const baseY = -1.5;
  const baseTopY = baseY + acrylicThickness / 2; // -1.46

  // 15° inclination angle from vertical for ergonomic 75° viewing angle
  const tiltAngle = (15 * Math.PI) / 180;

  // Center position of tilted face so bottom edge starts exactly at (0, baseTopY, frontEdgeZ)
  const faceCenterY = baseTopY + (faceHeight / 2) * Math.cos(tiltAngle);
  const faceCenterZ = frontEdgeZ - (faceHeight / 2) * Math.sin(tiltAngle);

  // Generate 2048x3072 Decal Texture
  const decalTexture = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const canvas = createLStandDecalTexture(
      template,
      isWhite,
      branding,
      logoText,
      businessName,
      qrText,
      showStars
    );
    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 16;
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.needsUpdate = true;
    return texture;
  }, [template, isWhite, branding, logoText, businessName, qrText, showStars]);

  useEffect(() => {
    if (decalTexture) {
      decalTexture.needsUpdate = true;
    }
    return () => {
      decalTexture?.dispose();
    };
  }, [decalTexture]);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    if (pulseRingRef.current) {
      pulseRingRef.current.scale.setScalar(1 + Math.sin(t * 3.5) * 0.08);
    }
    if (pulseRing2Ref.current) {
      pulseRing2Ref.current.scale.setScalar(1 + Math.cos(t * 3.5) * 0.06);
    }

    if (!groupRef.current) return;

    const targetRotX = pointer.y * 0.22;
    const targetRotY = pointer.x * 0.38;

    groupRef.current.rotation.x = THREE.MathUtils.damp(
      groupRef.current.rotation.x,
      targetRotX,
      3.5,
      delta
    );

    if (autoRotate && !hovered) {
      groupRef.current.rotation.y += delta * 0.45;
    } else {
      groupRef.current.rotation.y = THREE.MathUtils.damp(
        groupRef.current.rotation.y,
        targetRotY,
        3.5,
        delta
      );
    }
  });

  return (
    <group
      ref={groupRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      position={[0, -0.15, 0]}
    >
      <Float
        speed={hovered ? 3.5 : 2}
        rotationIntensity={hovered ? 0.35 : 0.2}
        floatIntensity={0.35}
        floatingRange={[-0.05, 0.05]}
      >
        {/* ──────────────────────────────────────────────────────────
            1. BASE FOOT: EXTENDS BACKWARDS FROM FRONT EDGE (+0.4)
            ────────────────────────────────────────────────────────── */}
        <group position={[0, baseY, frontEdgeZ - baseDepth / 2]}>
          <mesh castShadow receiveShadow position={[0, 0, 0]}>
            <boxGeometry args={[standWidth, acrylicThickness, baseDepth]} />
            {isWhite ? (
              <meshPhysicalMaterial
                color="#f4f4f5"
                roughness={0.35}
                transmission={0.02}
                opacity={0.98}
                transparent
                clearcoat={0.1}
                clearcoatRoughness={0.2}
                reflectivity={0.5}
                ior={1.5}
              />
            ) : (
              <meshPhysicalMaterial
                color="#0d0d0f"
                roughness={0.15}
                metalness={0.05}
                clearcoat={0.8}
                clearcoatRoughness={0.08}
                reflectivity={0.9}
                specularIntensity={1.0}
                specularColor="#ffffff"
              />
            )}
          </mesh>

          {/* Front Bevel Accent Glow Line */}
          <mesh position={[0, acrylicThickness / 2, baseDepth / 2 - 0.01]}>
            <boxGeometry args={[standWidth - 0.04, 0.015, 0.015]} />
            <meshStandardMaterial
              color={isWhite ? '#38bdf8' : '#e5c158'}
              metalness={0.9}
              roughness={0.1}
              emissive={isWhite ? '#38bdf8' : '#d4af37'}
              emissiveIntensity={0.45}
            />
          </mesh>

          {/* 4 Non-Slip Silicone Resting Foot Pads */}
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
          <cylinderGeometry args={[acrylicThickness / 2, acrylicThickness / 2, standWidth, 32]} />
          {isWhite ? (
            <meshPhysicalMaterial
              color="#f4f4f5"
              roughness={0.35}
              transmission={0.02}
              opacity={0.98}
              transparent
              clearcoat={0.1}
              clearcoatRoughness={0.2}
              reflectivity={0.5}
            />
          ) : (
            <meshPhysicalMaterial
              color="#0d0d0f"
              roughness={0.15}
              metalness={0.05}
              clearcoat={0.8}
              clearcoatRoughness={0.08}
              reflectivity={0.9}
              specularIntensity={1.0}
            />
          )}
        </mesh>

        {/* ──────────────────────────────────────────────────────────
            3. UPRIGHT FACE: TILTED AT ~75° STARTING AT FRONT EDGE
            ────────────────────────────────────────────────────────── */}
        <group position={[0, faceCenterY, faceCenterZ]} rotation={[-tiltAngle, 0, 0]}>
          {/* Monolithic Acrylic Slab */}
          <mesh castShadow receiveShadow position={[0, 0, 0]}>
            <boxGeometry args={[standWidth, faceHeight, acrylicThickness]} />
            {isWhite ? (
              <meshPhysicalMaterial
                color="#f4f4f5"
                roughness={0.35}
                transmission={0.02}
                opacity={0.98}
                transparent
                clearcoat={0.1}
                clearcoatRoughness={0.2}
                reflectivity={0.5}
                ior={1.5}
              />
            ) : (
              <meshPhysicalMaterial
                color="#0d0d0f"
                roughness={0.15}
                metalness={0.05}
                clearcoat={0.8}
                clearcoatRoughness={0.08}
                reflectivity={0.9}
                specularIntensity={1.0}
                specularColor="#ffffff"
              />
            )}
          </mesh>

          {/* Full-Bleed 100% UV Vector Texture Canvas Front Mesh */}
          {decalTexture && (
            <mesh position={[0, 0, acrylicThickness / 2 + 0.002]}>
              <planeGeometry args={[standWidth, faceHeight]} />
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

          {/* 3D Pulsing Gold NFC Emission Rings aligned with NFC tap icon */}
          <group position={[0, -0.48, acrylicThickness / 2 + 0.006]}>
            <mesh ref={pulseRingRef}>
              <torusGeometry args={[0.24, 0.008, 16, 32]} />
              <meshStandardMaterial
                color="#e5c158"
                metalness={0.9}
                roughness={0.1}
                transparent
                opacity={0.65}
                emissive="#d4af37"
                emissiveIntensity={0.55}
              />
            </mesh>
            <mesh ref={pulseRing2Ref}>
              <torusGeometry args={[0.33, 0.005, 16, 32]} />
              <meshStandardMaterial
                color="#fef08a"
                metalness={0.8}
                roughness={0.2}
                transparent
                opacity={0.4}
                emissive="#e5c158"
                emissiveIntensity={0.45}
              />
            </mesh>
          </group>
        </group>
      </Float>
    </group>
  );
}

/**
 * Complete Stand3D Canvas Component with Studio Pedestal Lighting
 */
export default function Stand3D({
  white = false,
  branding = true,
  qrText = 'g.page/r/doremusic',
  logoText = 'doremusic',
  businessName = 'doremusic Akasya AVM',
  showStars = true,
  template = 'templateA',
  autoRotate = true,
  className = 'w-full h-full',
}: Stand3DProps) {
  return (
    <Canvas
      camera={{ position: [0, 0.4, 5.8], fov: 42 }}
      dpr={[1, 2]}
      shadows
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      className={className}
    >
      {/* ── HIGH-END STUDIO LIGHTING RIG ── */}
      <ambientLight intensity={1.1} />

      {/* Main Warm Key Light */}
      <directionalLight
        position={[4, 7, 5]}
        intensity={2.8}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0001}
        color="#fffbf0"
      />

      {/* Cyan Rim Silhouette Light (Highlights Back & Side Edges of Black Acrylic) */}
      <directionalLight
        position={[-6, 4, -4]}
        intensity={2.4}
        color="#38bdf8"
      />

      {/* Cool White Secondary Rim Light */}
      <directionalLight
        position={[6, -2, -4]}
        intensity={1.8}
        color="#e0f2fe"
      />

      {/* Warm Golden Bottom Fill Light (Illuminates the Base Foot) */}
      <pointLight
        position={[0, -2.2, 3.5]}
        intensity={2.4}
        color="#fbbf24"
        distance={9}
      />

      {/* High-Key Top Spot */}
      <spotLight
        position={[0, 8, 2]}
        intensity={2.0}
        angle={0.7}
        penumbra={0.8}
        color="#ffffff"
      />

      {/* Studio Reflection Environment */}
      <Environment preset="city" />

      {/* Stand 3D Mesh */}
      <StandMesh
        white={white}
        branding={branding}
        qrText={qrText}
        logoText={logoText}
        businessName={businessName}
        showStars={showStars}
        template={template}
        autoRotate={autoRotate}
      />

      {/* Contact Floor Shadow Plane */}
      <ContactShadows
        position={[0, -1.56, 0]}
        opacity={0.65}
        scale={9}
        blur={2.2}
        far={4.5}
        color="#000000"
      />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 3.4}
        maxPolarAngle={Math.PI / 1.7}
        rotateSpeed={0.8}
      />
    </Canvas>
  );
}

export { Stand3D };

