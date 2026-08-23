'use client';

import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, ContactShadows, Environment, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

export interface Stand3DProps {
  white?: boolean;
  branding?: boolean;
  qrText?: string;
  logoText?: string;
  businessName?: string;
  showStars?: boolean;
  material?: string;
  autoRotate?: boolean;
  className?: string;
}

/**
 * Draws the official multicolored Google logo wordmark (Google)
 * G (#4285F4), o (#EA4335), o (#FBBC05), g (#4285F4), l (#34A853), e (#EA4335)
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
 * Draws the official Google 'G' multicolored icon badge
 */
function drawGoogleGIcon(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) {
  ctx.save();
  const radius = size / 2;
  const lineWidth = radius * 0.42;
  const midRadius = radius - lineWidth / 2;

  // Background circle for maximum contrast
  ctx.beginPath();
  ctx.arc(cx, cy, radius + 2, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();

  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'butt';

  // 1. Red Top Arc (180° to 315° / -45°)
  ctx.strokeStyle = '#EA4335';
  ctx.beginPath();
  ctx.arc(cx, cy, midRadius, Math.PI * 1.05, Math.PI * 1.78);
  ctx.stroke();

  // 2. Blue Top-Right Quadrant
  ctx.strokeStyle = '#4285F4';
  ctx.beginPath();
  ctx.arc(cx, cy, midRadius, Math.PI * 1.78, Math.PI * 2.05);
  ctx.stroke();

  // 3. Green Bottom Arc (0° to 115°)
  ctx.strokeStyle = '#34A853';
  ctx.beginPath();
  ctx.arc(cx, cy, midRadius, Math.PI * 0.0, Math.PI * 0.65);
  ctx.stroke();

  // 4. Yellow Left Arc (115° to 195°)
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
 * Draws the Google 4-Color Accent Line (Blue, Red, Yellow, Green)
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
 * Draws a 5-pointed star with gold metallic gradient
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
 * Draws a vertical side badge (e.g. "★ Google account required")
 */
function drawVerticalSideBadge(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  height: number,
  text: string,
  isWhite: boolean
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-Math.PI / 2);

  const pillW = height;
  const pillH = 26;
  roundRect(ctx, -pillW / 2, -pillH / 2, pillW, pillH, pillH / 2);
  ctx.fillStyle = isWhite ? 'rgba(15, 23, 42, 0.08)' : 'rgba(255, 255, 255, 0.08)';
  ctx.fill();
  ctx.strokeStyle = isWhite ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.16)';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  ctx.font = '700 12px "Google Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = isWhite ? '#475569' : '#94a3b8';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 0, 0);

  ctx.restore();
}

/**
 * Generates the High-Resolution HTML5 Canvas Decal matching physical L-Stand specifications:
 * - Top: Official Google 'G' / wordmark + 5 golden stars + "Review us on Google"
 * - Center: Scannable QR code (qrText) + vertical "Google account required" side badge
 * - Sub-icons: Tap (NFC) & Scan (QR) icons with "Tap | or | Scan" labels
 * - Bottom: "Your Logo / Business Name" customizable branding badge (if branding=true) + contactless NFC corner icon
 */
function createLStandDecalTexture(
  isWhite: boolean,
  branding: boolean,
  logoText: string,
  businessName: string,
  qrText: string,
  showStars: boolean
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1536; // 10cm x 15cm aspect ratio (1 : 1.5)
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const primaryText = isWhite ? '#0f172a' : '#ffffff';
  const secondaryText = isWhite ? '#475569' : '#cbd5e1';
  const accentGold = '#f59e0b';
  const qrBoxBg = '#ffffff'; // High-contrast crisp white background for QR
  const qrModuleColor = '#0a0a0c';

  // ── Acrylic Card Background ──
  roundRect(ctx, 24, 24, canvas.width - 48, canvas.height - 48, 44);
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

  // ─────────────────────────────────────────────────────────────
  // 1. TOP HEADER: "Review us on Google" + Google G + 5 Gold Stars
  // ─────────────────────────────────────────────────────────────
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Title: "Review us on"
  ctx.font = '700 36px "Google Sans", "Product Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = primaryText;
  ctx.fillText('Review us on', 512, 105);

  // Multicolored Google Wordmark
  drawGoogleWordmark(ctx, 512, 175, 78);

  // 5 Golden Stars
  if (showStars) {
    const starY = 250;
    const starSpacing = 44;
    const startX = 512 - 2 * starSpacing;
    for (let i = 0; i < 5; i++) {
      drawStar(ctx, startX + i * starSpacing, starY, 5, 18, 8.5);
    }
  }

  // 4-Color Accent Line
  draw4ColorAccentLine(ctx, 512, 305, 580, 7);

  // ─────────────────────────────────────────────────────────────
  // 2. CENTER SECTION: HIGH-CONTRAST QR CODE + VERTICAL SIDE BADGE
  // ─────────────────────────────────────────────────────────────
  const qrCenterY = 560;
  const qrCenterX = 512;
  const qrBoxSize = 310;
  const qrBoxX = qrCenterX - qrBoxSize / 2;
  const qrBoxY = qrCenterY - qrBoxSize / 2;

  // High contrast white QR container card
  roundRect(ctx, qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 24);
  ctx.fillStyle = qrBoxBg;
  ctx.fill();
  ctx.strokeStyle = accentGold;
  ctx.lineWidth = 3.5;
  ctx.stroke();

  // QR Pattern Matrix
  const qrPadding = 24;
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
        ctx.fillRect(
          qrInnerX + c * cellSize,
          qrInnerY + r * cellSize,
          cellSize * 0.96,
          cellSize * 0.96
        );
      }
    }
  }

  // Center Google 'G' Icon Badge in QR matrix
  const qrLogoSize = cellSize * 5.5;
  const qrLogoCenterX = qrInnerX + qrInnerSize / 2;
  const qrLogoCenterY = qrInnerY + qrInnerSize / 2;
  roundRect(
    ctx,
    qrLogoCenterX - qrLogoSize / 2,
    qrLogoCenterY - qrLogoSize / 2,
    qrLogoSize,
    qrLogoSize,
    8
  );
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  drawGoogleGIcon(ctx, qrLogoCenterX, qrLogoCenterY, qrLogoSize * 0.72);

  // Vertical "Google account required" Side Badge
  drawVerticalSideBadge(
    ctx,
    qrBoxX - 22,
    qrCenterY,
    qrBoxSize - 20,
    '★ Google account required',
    isWhite
  );

  // ─────────────────────────────────────────────────────────────
  // 3. SUB-ICONS & LABELS: TAP (NFC) | OR | SCAN (QR)
  // ─────────────────────────────────────────────────────────────
  const subActionY = 775;

  // ── LEFT: TAP (NFC) ──
  const tapX = 275;
  // Phone outline
  roundRect(ctx, tapX - 22, subActionY - 32, 44, 64, 10);
  ctx.fillStyle = isWhite ? '#0f172a' : '#1e1e24';
  ctx.fill();
  ctx.strokeStyle = accentGold;
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Screen
  roundRect(ctx, tapX - 16, subActionY - 26, 32, 52, 6);
  ctx.fillStyle = isWhite ? '#ffffff' : '#0d0d10';
  ctx.fill();

  // Contactless waves above phone
  ctx.strokeStyle = accentGold;
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(tapX, subActionY - 38, 10, -Math.PI * 0.75, -Math.PI * 0.25);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(tapX, subActionY - 38, 18, -Math.PI * 0.75, -Math.PI * 0.25);
  ctx.stroke();

  ctx.font = '900 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = primaryText;
  ctx.textAlign = 'center';
  ctx.fillText('Tap', tapX, subActionY + 56);

  ctx.font = '600 15px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillStyle = secondaryText;
  ctx.fillText('Touch phone here', tapX, subActionY + 80);

  // ── CENTER: "OR" DIVIDER ──
  const orX = 512;
  ctx.beginPath();
  ctx.arc(orX, subActionY + 10, 24, 0, Math.PI * 2);
  ctx.fillStyle = isWhite ? '#e2e8f0' : '#1e1e24';
  ctx.fill();
  ctx.strokeStyle = accentGold;
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.font = '900 16px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillStyle = accentGold;
  ctx.textAlign = 'center';
  ctx.fillText('OR', orX, subActionY + 11);

  // ── RIGHT: SCAN (QR) ──
  const scanX = 745;
  // QR Viewfinder icon
  const vfSize = 48;
  const vfX = scanX - vfSize / 2;
  const vfY = subActionY - 24;
  ctx.strokeStyle = accentGold;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';

  // 4 corner brackets
  const bLen = 12;
  // Top-left
  ctx.beginPath();
  ctx.moveTo(vfX, vfY + bLen);
  ctx.lineTo(vfX, vfY);
  ctx.lineTo(vfX + bLen, vfY);
  ctx.stroke();
  // Top-right
  ctx.beginPath();
  ctx.moveTo(vfX + vfSize - bLen, vfY);
  ctx.lineTo(vfX + vfSize, vfY);
  ctx.lineTo(vfX + vfSize, vfY + bLen);
  ctx.stroke();
  // Bottom-left
  ctx.beginPath();
  ctx.moveTo(vfX, vfY + vfSize - bLen);
  ctx.lineTo(vfX, vfY + vfSize);
  ctx.lineTo(vfX + bLen, vfY + vfSize);
  ctx.stroke();
  // Bottom-right
  ctx.beginPath();
  ctx.moveTo(vfX + vfSize - bLen, vfY + vfSize);
  ctx.lineTo(vfX + vfSize, vfY + vfSize);
  ctx.lineTo(vfX + vfSize, vfY + vfSize - bLen);
  ctx.stroke();

  // Mini center lens
  ctx.beginPath();
  ctx.arc(scanX, vfY + vfSize / 2, 7, 0, Math.PI * 2);
  ctx.fillStyle = accentGold;
  ctx.fill();

  ctx.font = '900 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = primaryText;
  ctx.textAlign = 'center';
  ctx.fillText('Scan', scanX, subActionY + 56);

  ctx.font = '600 15px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillStyle = secondaryText;
  ctx.fillText('Open camera & scan', scanX, subActionY + 80);

  // ─────────────────────────────────────────────────────────────
  // 4. HORIZONTAL DIVIDER
  // ─────────────────────────────────────────────────────────────
  ctx.strokeStyle = isWhite ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(90, 920);
  ctx.lineTo(934, 920);
  ctx.stroke();

  // ─────────────────────────────────────────────────────────────
  // 5. BOTTOM SECTION: BRANDING BADGES & CONTACTLESS NFC CORNER
  // ─────────────────────────────────────────────────────────────
  const footerX = 90;
  const footerY = 960;

  if (branding) {
    const pillWidth = 580;

    // Brand Pill Badge 1
    roundRect(ctx, footerX, footerY, pillWidth, 74, 37);
    if (isWhite) {
      ctx.fillStyle = '#0f172a';
      ctx.fill();
      ctx.strokeStyle = accentGold;
      ctx.lineWidth = 2.5;
      ctx.stroke();
    } else {
      ctx.fillStyle = 'rgba(251, 191, 36, 0.12)';
      ctx.fill();
      ctx.strokeStyle = accentGold;
      ctx.lineWidth = 2.5;
      ctx.stroke();
    }

    ctx.font = '900 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = isWhite ? '#ffffff' : '#fbbf24';
    ctx.textAlign = 'center';
    ctx.fillText(logoText || 'Your Logo / Business Name', footerX + pillWidth / 2, footerY + 37);

    // Business Name Pill Badge 2
    const subPillY = footerY + 92;
    roundRect(ctx, footerX, subPillY, pillWidth, 68, 34);
    if (isWhite) {
      ctx.fillStyle = '#f1f5f9';
      ctx.fill();
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.stroke();
    } else {
      ctx.fillStyle = '#18181c';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    ctx.font = '700 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = isWhite ? '#334155' : '#e2e8f0';
    ctx.textAlign = 'center';
    ctx.fillText(
      businessName || 'Business Name (Optional)',
      footerX + pillWidth / 2,
      subPillY + 34
    );

    // Tagline
    ctx.font = '600 16px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillStyle = isWhite ? '#94a3b8' : '#71717a';
    ctx.textAlign = 'left';
    ctx.fillText('⚡ Instant Google Review • Powered by NFCMyPlace', footerX + 12, subPillY + 104);

    // Bottom-Right Corner: Contactless NFC Wave Icon in Circle Badge
    const nfcCircleX = 815;
    const nfcCircleY = footerY + 76;
    const nfcRadius = 56;

    ctx.beginPath();
    ctx.arc(nfcCircleX, nfcCircleY, nfcRadius, 0, Math.PI * 2);
    ctx.fillStyle = isWhite ? '#0f172a' : '#141418';
    ctx.fill();
    ctx.strokeStyle = accentGold;
    ctx.lineWidth = 3;
    ctx.stroke();

    // Contactless wave arcs
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
  } else {
    // Minimalist NFC Tap Banner when branding is false
    const bannerW = 840;
    roundRect(ctx, 512 - bannerW / 2, footerY + 20, bannerW, 130, 30);
    ctx.fillStyle = isWhite ? '#0f172a' : 'rgba(251, 191, 36, 0.1)';
    ctx.fill();
    ctx.strokeStyle = accentGold;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.font = '900 32px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = isWhite ? '#ffffff' : '#fbbf24';
    ctx.textAlign = 'center';
    ctx.fillText('⚡ CONTACTLESS DIRECT REVIEW ⚡', 512, footerY + 70);

    ctx.font = '600 18px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillStyle = isWhite ? '#94a3b8' : '#cbd5e1';
    ctx.fillText('Instant Google Maps 5-Star Review in < 0.2s', 512, footerY + 110);
  }

  return canvas;
}

/**
 * Creates 2D rounded rectangle shape for ExtrudeGeometry
 */
function createRoundedRectShape(
  width: number,
  height: number,
  radius: number
): THREE.Shape {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;
  const w = width;
  const h = height;
  const r = Math.min(radius, w / 2, h / 2);

  shape.moveTo(x + r, y);
  shape.lineTo(x + w - r, y);
  shape.quadraticCurveTo(x + w, y, x + w, y + r);
  shape.lineTo(x + w, y + h - r);
  shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  shape.lineTo(x + r, y + h);
  shape.quadraticCurveTo(x, y + h, x, y + h - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);

  return shape;
}

/**
 * Monolithic L-Stand 3D Model:
 * - Base block: 10cm x 6cm x 0.4cm resting flat on floor
 * - Upright face: 10cm x 15cm x 0.4cm tilted back at ~75° viewing angle (15° incline from vertical)
 * - Chamfered/rounded corners and physical acrylic depth (0.4cm)
 * - MeshPhysicalMaterial (roughness: 0.1, transmission: 0.15, clearcoat: 1.0, reflectivity: 0.9)
 */
function StandMesh({
  white = false,
  branding = true,
  qrText = 'https://g.page/r/review',
  logoText = 'Baltazar',
  businessName = 'Gourmet Burger & Bistro',
  showStars = true,
  autoRotate = true,
}: Stand3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const pulseRingRef = useRef<THREE.Mesh>(null);
  const pulseRing2Ref = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const { pointer } = useThree();

  const isWhite = Boolean(white);

  // Exact Physical Dimension Ratios (Scale factor 0.25: 10cm -> 2.5 units, 6cm -> 1.5 units, 15cm -> 3.75 units, 0.4cm -> 0.10 units)
  const standWidth = 2.5; // 10 cm
  const baseDepth = 1.5; // 6 cm
  const faceHeight = 3.75; // 15 cm
  const acrylicThickness = 0.1; // 0.4 cm

  // 15° inclination angle from vertical for ergonomic 75° viewing angle
  const tiltAngle = (15 * Math.PI) / 180;

  // Base Extrusion Geometry with Chamfered Corners
  const baseGeometry = useMemo(() => {
    const shape = createRoundedRectShape(standWidth, baseDepth, 0.08);
    return new THREE.ExtrudeGeometry(shape, {
      steps: 1,
      depth: acrylicThickness - 0.02,
      bevelEnabled: true,
      bevelThickness: 0.01,
      bevelSize: 0.01,
      bevelSegments: 3,
    });
  }, [standWidth, baseDepth, acrylicThickness]);

  // Upright Face Extrusion Geometry with Chamfered Corners
  const faceGeometry = useMemo(() => {
    const shape = createRoundedRectShape(standWidth, faceHeight, 0.12);
    return new THREE.ExtrudeGeometry(shape, {
      steps: 1,
      depth: acrylicThickness - 0.02,
      bevelEnabled: true,
      bevelThickness: 0.01,
      bevelSize: 0.01,
      bevelSegments: 3,
    });
  }, [standWidth, faceHeight, acrylicThickness]);

  // Generate High-Res Decal Canvas Texture
  const decalTexture = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const canvas = createLStandDecalTexture(
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
  }, [isWhite, branding, logoText, businessName, qrText, showStars]);

  useEffect(() => {
    if (decalTexture) {
      decalTexture.needsUpdate = true;
    }
  }, [decalTexture]);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // Pulse animation on 3D NFC indicator
    if (pulseRingRef.current) {
      pulseRingRef.current.scale.setScalar(1 + Math.sin(t * 3.5) * 0.08);
    }
    if (pulseRing2Ref.current) {
      pulseRing2Ref.current.scale.setScalar(1 + Math.cos(t * 3.5) * 0.06);
    }

    if (!groupRef.current) return;

    // Smooth subtle mouse parallax tilt
    const targetRotX = pointer.y * 0.22;
    const targetRotY = pointer.x * 0.38;

    groupRef.current.rotation.x = THREE.MathUtils.damp(
      groupRef.current.rotation.x,
      targetRotX,
      3.5,
      delta
    );

    // Auto rotate unless hovered
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
      position={[0, -0.2, 0]}
    >
      <Float
        speed={hovered ? 3.5 : 2}
        rotationIntensity={hovered ? 0.35 : 0.2}
        floatIntensity={0.4}
        floatingRange={[-0.06, 0.06]}
      >
        {/* ──────────────────────────────────────────────────────────
            1. BASE BLOCK: 10cm x 6cm x 0.4cm RESTING FLAT ON THE FLOOR
            ────────────────────────────────────────────────────────── */}
        <group position={[0, -1.82, 0.3]}>
          <mesh
            geometry={baseGeometry}
            castShadow
            receiveShadow
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, 0, 0]}
          >
            <meshPhysicalMaterial
              color={isWhite ? '#f8f9fa' : '#0d0d0e'}
              roughness={0.1}
              transmission={0.15}
              clearcoat={1.0}
              clearcoatRoughness={0.08}
              reflectivity={0.9}
              ior={1.5}
              metalness={isWhite ? 0.02 : 0.12}
              transparent
              opacity={isWhite ? 0.98 : 0.99}
            />
          </mesh>

          {/* Front Bevel Accent Glow Line */}
          <mesh position={[0, 0.05, 0.74]}>
            <boxGeometry args={[standWidth - 0.04, 0.015, 0.015]} />
            <meshStandardMaterial
              color={isWhite ? '#38bdf8' : '#f59e0b'}
              metalness={0.9}
              roughness={0.1}
              emissive={isWhite ? '#38bdf8' : '#d97706'}
              emissiveIntensity={0.35}
            />
          </mesh>

          {/* 4 Non-Slip Silicone Resting Foot Pads */}
          {[-1.05, 1.05].flatMap((x) =>
            [-0.55, 0.55].map((z, i) => (
              <mesh key={`${x}-${z}-${i}`} position={[x, -0.055, z]}>
                <cylinderGeometry args={[0.06, 0.06, 0.02, 16]} />
                <meshStandardMaterial color="#111111" roughness={0.9} />
              </mesh>
            ))
          )}
        </group>

        {/* ──────────────────────────────────────────────────────────
            2. UPRIGHT FACE: 10cm x 15cm x 0.4cm TILTED AT ~75° ANGLE
            ────────────────────────────────────────────────────────── */}
        <group position={[0, 0.04, -0.14]} rotation={[-tiltAngle, 0, 0]}>
          {/* Monolithic Physical Acrylic Slab */}
          <mesh geometry={faceGeometry} castShadow receiveShadow position={[0, 0, 0]}>
            <meshPhysicalMaterial
              color={isWhite ? '#f8f9fa' : '#0d0d0e'}
              roughness={0.1}
              transmission={0.15}
              clearcoat={1.0}
              clearcoatRoughness={0.08}
              reflectivity={0.9}
              ior={1.5}
              metalness={isWhite ? 0.02 : 0.12}
              transparent
              opacity={isWhite ? 0.98 : 0.99}
            />
          </mesh>

          {/* Subtle Polished Glass Refraction Wire Highlight */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[standWidth + 0.01, faceHeight + 0.01, acrylicThickness]} />
            <meshStandardMaterial
              color={isWhite ? '#bae6fd' : '#f59e0b'}
              transparent
              opacity={isWhite ? 0.15 : 0.1}
              wireframe
            />
          </mesh>

          {/* ────────────────────────────────────────────────────────
              3. HIGH-RESOLUTION DYNAMIC FRONT DECAL CANVAS
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
              4. 3D PULSING GOLD FOIL NFC INDICATOR RINGS
              ──────────────────────────────────────────────────────── */}
          <group position={[0.75, -1.28, acrylicThickness / 2 + 0.006]}>
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
      </Float>
    </group>
  );
}

/**
 * Complete Stand3D Canvas Component:
 * - Studio Lighting Rig (Key, Cyan Rim, Floor Bounce, Top Spot, HDRI Environment)
 * - Monolithic L-Stand 3D Model with exact physical geometry & MeshPhysicalMaterial
 * - ContactShadows floor
 * - OrbitControls with limited vertical pitch
 */
export default function Stand3D({
  white = false,
  branding = true,
  qrText = 'https://g.page/r/review',
  logoText = 'Baltazar',
  businessName = 'Gourmet Burger & Bistro',
  showStars = true,
  autoRotate = true,
  className = 'w-full h-full',
}: Stand3DProps) {
  return (
    <Canvas
      camera={{ position: [0, 0.5, 6.2], fov: 42 }}
      dpr={[1, 2]}
      shadows
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      className={className}
    >
      {/* ── STUDIO LIGHTING RIG ── */}
      <ambientLight intensity={0.85} />

      {/* Main Warm Studio Key Light */}
      <directionalLight
        position={[5, 8, 6]}
        intensity={2.4}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0001}
        color="#fffbeb"
      />

      {/* Cyan Rim Fill Light */}
      <directionalLight
        position={[-6, 4, -4]}
        intensity={1.2}
        color="#06b6d4"
      />

      {/* Warm Golden Bottom Bounce */}
      <pointLight
        position={[0, -2.5, 3]}
        intensity={1.6}
        color="#f59e0b"
        distance={8}
      />

      {/* Top Soft Studio Spot */}
      <spotLight
        position={[0, 7, 1]}
        intensity={1.3}
        angle={0.6}
        penumbra={0.8}
        color="#ffffff"
      />

      {/* HDRI Environment Reflections */}
      <Environment preset="city" />

      {/* ── 3D L-STAND OBJECT ── */}
      <StandMesh
        white={white}
        branding={branding}
        qrText={qrText}
        logoText={logoText}
        businessName={businessName}
        showStars={showStars}
        autoRotate={autoRotate}
      />

      {/* ── CONTACT SHADOWS FLOOR ── */}
      <ContactShadows
        position={[0, -2.1, 0]}
        opacity={0.75}
        scale={10}
        blur={2.4}
        far={4.5}
        color="#000000"
      />

      {/* ── ORBIT CONTROLS WITH CONSTRAINED POLAR ANGLES ── */}
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
