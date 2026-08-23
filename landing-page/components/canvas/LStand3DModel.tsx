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
 * Draws Google'da bizi with official Google colors + suffix
 */
function drawGoogleDaBizi(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  fontSize: number = 60,
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
  ctx.lineWidth = 1.4;
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
 * Draws Gold Musical Note Emblem (♪) + "doremusic" Typography
 */
function drawMusicNoteAndBrand(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  brandText: string = 'doremusic',
  isWhite: boolean = false
) {
  ctx.save();
  const goldColor = isWhite ? '#b45309' : '#fbbf24';
  const goldGrad = ctx.createLinearGradient(cx - 160, cy, cx + 160, cy);
  goldGrad.addColorStop(0, '#fde047');
  goldGrad.addColorStop(0.5, '#f59e0b');
  goldGrad.addColorStop(1, '#d97706');

  // Double beamed musical note emblem ♫
  const noteX = cx - 148;
  const noteY = cy;

  ctx.fillStyle = goldGrad;
  ctx.strokeStyle = goldGrad;
  ctx.lineWidth = 3.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Left note head (tilted ellipse)
  ctx.beginPath();
  ctx.ellipse(noteX - 16, noteY + 10, 11, 8, -Math.PI / 6, 0, Math.PI * 2);
  ctx.fill();

  // Right note head (tilted ellipse)
  ctx.beginPath();
  ctx.ellipse(noteX + 14, noteY + 5, 11, 8, -Math.PI / 6, 0, Math.PI * 2);
  ctx.fill();

  // Left stem
  ctx.beginPath();
  ctx.moveTo(noteX - 8, noteY + 8);
  ctx.lineTo(noteX - 8, noteY - 18);
  ctx.stroke();

  // Right stem
  ctx.beginPath();
  ctx.moveTo(noteX + 22, noteY + 3);
  ctx.lineTo(noteX + 22, noteY - 23);
  ctx.stroke();

  // Top connecting beam
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(noteX - 9, noteY - 16);
  ctx.lineTo(noteX + 23, noteY - 21);
  ctx.stroke();

  // Brand Typography in Gold
  ctx.font = '800 42px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = goldGrad;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.letterSpacing = '3px';
  ctx.fillText(brandText, noteX + 44, cy);

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
  const primaryGold = '#fbbf24';
  const lightGold = '#fde047';

  // Phone body
  const phoneW = 52;
  const phoneH = 84;
  const phoneX = cx - phoneW / 2;
  const phoneY = cy - phoneH / 2;

  roundRect(ctx, phoneX, phoneY, phoneW, phoneH, 12);
  ctx.fillStyle = isWhite ? '#ffffff' : '#18181b';
  ctx.fill();
  ctx.strokeStyle = primaryGold;
  ctx.lineWidth = 3.5;
  ctx.stroke();

  // Phone screen inner
  roundRect(ctx, phoneX + 5, phoneY + 8, phoneW - 10, phoneH - 18, 6);
  ctx.fillStyle = isWhite ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)';
  ctx.fill();

  // Phone speaker notch
  ctx.beginPath();
  ctx.moveTo(cx - 10, phoneY + 4);
  ctx.lineTo(cx + 10, phoneY + 4);
  ctx.strokeStyle = primaryGold;
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Phone NFC logo inside screen
  ctx.beginPath();
  ctx.arc(cx, cy - 1, 13, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(245, 158, 11, 0.2)';
  ctx.fill();
  ctx.strokeStyle = primaryGold;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.font = '900 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = primaryGold;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('NFC', cx, cy - 1);

  // Wireless wave emission arcs above the phone
  ctx.strokeStyle = lightGold;
  ctx.lineWidth = 3.5;
  ctx.lineCap = 'round';

  // Wave 1 (Inner Arc)
  ctx.beginPath();
  ctx.arc(cx, phoneY - 6, 18, -Math.PI * 0.75, -Math.PI * 0.25);
  ctx.stroke();

  // Wave 2 (Mid Arc)
  ctx.beginPath();
  ctx.arc(cx, phoneY - 6, 32, -Math.PI * 0.75, -Math.PI * 0.25);
  ctx.stroke();

  // Wave 3 (Outer Arc)
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.6)';
  ctx.beginPath();
  ctx.arc(cx, phoneY - 6, 46, -Math.PI * 0.75, -Math.PI * 0.25);
  ctx.stroke();

  // Side waves left & right
  ctx.strokeStyle = primaryGold;
  ctx.lineWidth = 3;
  // Left wave
  ctx.beginPath();
  ctx.arc(phoneX - 4, cy, 20, Math.PI * 0.7, Math.PI * 1.3);
  ctx.stroke();
  // Right wave
  ctx.beginPath();
  ctx.arc(phoneX + phoneW + 4, cy, 20, -Math.PI * 0.3, Math.PI * 0.3);
  ctx.stroke();

  ctx.restore();
}

/**
 * QR Code pattern drawing helper with clean Gold Border Box & Google 'G' in center
 */
function drawQRMatrixWithGoldBox(
  ctx: CanvasRenderingContext2D,
  qrBoxX: number,
  qrBoxY: number,
  qrBoxSize: number,
  qrText: string,
  isWhite: boolean
) {
  const qrPadding = 24;
  const qrInnerX = qrBoxX + qrPadding;
  const qrInnerY = qrBoxY + qrPadding;
  const qrInnerSize = qrBoxSize - qrPadding * 2;
  const moduleCount = 25;
  const cellSize = qrInnerSize / moduleCount;

  // Background Box with Gold Border
  roundRect(ctx, qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 24);
  ctx.fillStyle = '#ffffff';
  ctx.fill();

  const goldGrad = ctx.createLinearGradient(qrBoxX, qrBoxY, qrBoxX + qrBoxSize, qrBoxY + qrBoxSize);
  goldGrad.addColorStop(0, '#fde047');
  goldGrad.addColorStop(0.5, '#f59e0b');
  goldGrad.addColorStop(1, '#d97706');

  ctx.strokeStyle = goldGrad;
  ctx.lineWidth = 4;
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
      if (r >= 9 && r <= 15 && c >= 9 && c <= 15) continue;

      const seed = Math.sin(r * 29.3 + c * 19.7 + hash) * 10000;
      if (seed - Math.floor(seed) > 0.48) {
        ctx.fillRect(qrInnerX + c * cellSize, qrInnerY + r * cellSize, cellSize * 0.96, cellSize * 0.96);
      }
    }
  }

  // Centered Google 'G' icon in the middle of QR code
  const qrLogoSize = cellSize * 5.6;
  const qrLogoCenterX = qrInnerX + qrInnerSize / 2;
  const qrLogoCenterY = qrInnerY + qrInnerSize / 2;
  roundRect(ctx, qrLogoCenterX - qrLogoSize / 2, qrLogoCenterY - qrLogoSize / 2, qrLogoSize, qrLogoSize, 8);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  drawGoogleGIcon(ctx, qrLogoCenterX, qrLogoCenterY, qrLogoSize * 0.76);
}

/**
 * MASTER DECAL GENERATOR (IMAGE 1 REFERENCE)
 * Transparent alpha background: meshPhysicalMaterial shines directly through behind ink!
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

  // Direct UV Print Physics: Clear transparent canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const primaryText = isWhite ? '#111827' : '#ffffff';
  const secondaryText = isWhite ? '#475569' : '#cbd5e1';
  const accentGold = '#f59e0b';

  // ═════════════════════════════════════════════════════════════
  // 1. FINE GOLDEN DOUBLE BORDER INSET LINE FRAMING FRONT FACE
  // ═════════════════════════════════════════════════════════════
  // Outer Golden Line
  roundRect(ctx, 36, 36, canvas.width - 72, canvas.height - 72, 34);
  const borderGrad = ctx.createLinearGradient(36, 36, canvas.width - 36, canvas.height - 36);
  borderGrad.addColorStop(0, '#fde047');
  borderGrad.addColorStop(0.5, '#f59e0b');
  borderGrad.addColorStop(1, '#d97706');
  ctx.strokeStyle = borderGrad;
  ctx.lineWidth = 2.8;
  ctx.stroke();

  // Inner Inset Hairline
  roundRect(ctx, 48, 48, canvas.width - 96, canvas.height - 96, 24);
  ctx.strokeStyle = isWhite ? 'rgba(180, 83, 9, 0.45)' : 'rgba(251, 191, 36, 0.45)';
  ctx.lineWidth = 1.4;
  ctx.stroke();

  // ═════════════════════════════════════════════════════════════
  // 2. TOP: GOLD MUSICAL NOTE EMBLEM (♪) + "doremusic" TYPOGRAPHY
  // ═════════════════════════════════════════════════════════════
  const topBrandText = logoText || 'doremusic';
  drawMusicNoteAndBrand(ctx, 512, 115, topBrandText, isWhite);

  // ═════════════════════════════════════════════════════════════
  // 3. TITLE: MULTICOLORED "Google'da bizi" + BOLD "değerlendirin"
  // ═════════════════════════════════════════════════════════════
  drawGoogleDaBizi(ctx, 512, 205, 58, primaryText);

  ctx.font = '800 46px "Google Sans", "Product Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = primaryText;
  ctx.textAlign = 'center';
  ctx.letterSpacing = '0.5px';
  ctx.fillText('değerlendirin', 512, 268);

  // 4-Color Accent Line
  draw4ColorAccentLine(ctx, 512, 318, 500, 6);

  // ═════════════════════════════════════════════════════════════
  // 4. CENTER: HIGH-CONTRAST SQUARE QR CODE WITH CLEAN GOLD BORDER & GOOGLE 'G'
  // ═════════════════════════════════════════════════════════════
  const qrBoxSize = 340;
  const qrBoxX = 512 - qrBoxSize / 2;
  const qrBoxY = 360;

  drawQRMatrixWithGoldBox(ctx, qrBoxX, qrBoxY, qrBoxSize, qrText, isWhite);

  // ═════════════════════════════════════════════════════════════
  // 5. SUB-ACTION: GOLD SMARTPHONE NFC TAP ICON WITH WIRELESS WAVE EMISSION
  // ═════════════════════════════════════════════════════════════
  const nfcRowY = 770;
  drawSmartphoneNFCIcon(ctx, 512, nfcRowY, isWhite);

  ctx.font = '800 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = isWhite ? '#b45309' : '#fbbf24';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '1px';
  ctx.fillText('TEMASSIZ DOKUNUŞ VEYA QR TARAMA', 512, nfcRowY + 68);

  // ═════════════════════════════════════════════════════════════
  // 6. INSTRUCTION CARD: "Kodu tarayın veya telefonunuzu yaklaştırınız ve ne düşündüğünüzü bize söyleyin."
  // ═════════════════════════════════════════════════════════════
  const instructCardY = 890;
  const instructCardW = 860;
  const instructCardH = 118;
  const instructCardX = 512 - instructCardW / 2;

  roundRect(ctx, instructCardX, instructCardY, instructCardW, instructCardH, 22);
  ctx.fillStyle = isWhite ? 'rgba(17, 24, 39, 0.04)' : 'rgba(251, 191, 36, 0.07)';
  ctx.fill();
  ctx.strokeStyle = isWhite ? 'rgba(17, 24, 39, 0.14)' : 'rgba(251, 191, 36, 0.35)';
  ctx.lineWidth = 2.2;
  ctx.stroke();

  ctx.font = '700 22px -apple-system, sans-serif';
  ctx.fillStyle = accentGold;
  ctx.fillText('✦', instructCardX + 38, instructCardY + 40);
  ctx.fillText('✨', instructCardX + instructCardW - 38, instructCardY + instructCardH - 36);

  ctx.font = '800 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = primaryText;
  ctx.textAlign = 'center';
  ctx.fillText(
    'Kodu tarayın veya telefonunuzu yaklaştırınız',
    512,
    instructCardY + 42
  );

  ctx.font = '700 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = isWhite ? '#b45309' : '#fbbf24';
  ctx.fillText(
    've ne düşündüğünüzü bize söyleyin.',
    512,
    instructCardY + 84
  );

  // ═════════════════════════════════════════════════════════════
  // 7. RATING: 5 CENTERED SOLID GOLDEN STARS ⭐⭐⭐⭐⭐ AT THE BOTTOM
  // ═════════════════════════════════════════════════════════════
  if (showStars) {
    const starCenterY = 1065;
    const starSpacing = 58;
    const starStartX = 512 - 2 * starSpacing;
    for (let i = 0; i < 5; i++) {
      drawStar(ctx, starStartX + i * starSpacing, starCenterY, 5, 23, 11);
    }
  }

  // ═════════════════════════════════════════════════════════════
  // 8. BOTTOM TAGLINE FOOTER WITH GOOGLE 'G'
  // ═════════════════════════════════════════════════════════════
  const gIconY = 1175;
  drawGoogleGIcon(ctx, 512, gIconY, 52);

  ctx.font = '600 15px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillStyle = isWhite ? '#94a3b8' : 'rgba(255, 255, 255, 0.7)';
  ctx.textAlign = 'center';
  ctx.fillText('⚡ Powered by NFCMyPlace® • Temassız Google Yorum Standı', 512, 1370);

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

  // Exact Physical Dimension Geometry
  const standWidth = 2.5;
  const baseDepth = 1.4;
  const faceHeight = 3.5;
  const acrylicThickness = 0.08;
  const frontEdgeZ = 0.4;
  const baseY = -1.5;
  const baseTopY = baseY + acrylicThickness / 2; // -1.46

  // Upright face center position so its bottom edge meets (0, baseTopY, frontEdgeZ)
  const faceCenterY = baseTopY + (faceHeight / 2) * Math.cos(tiltAngle);
  const faceCenterZ = frontEdgeZ - (faceHeight / 2) * Math.sin(tiltAngle);

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
              roughness={0.35}
              transmission={0.05}
              opacity={0.98}
              transparent
              clearcoat={0.1}
              clearcoatRoughness={0.2}
              reflectivity={0.5}
              ior={1.5}
            />
          ) : (
            <meshPhysicalMaterial
              color="#16161a"
              roughness={0.14}
              metalness={0.12}
              clearcoat={1.0}
              clearcoatRoughness={0.06}
              reflectivity={0.9}
              specularIntensity={1.0}
              specularColor="#ffffff"
            />
          )}
        </mesh>

        {/* Polished Foot Chamfer Outline Rim */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[standWidth + 0.005, acrylicThickness + 0.005, baseDepth + 0.005]} />
          <meshStandardMaterial
            color={isWhite ? '#38bdf8' : '#fbbf24'}
            transparent
            opacity={isWhite ? 0.2 : 0.15}
            wireframe
          />
        </mesh>

        {/* Front Edge Bevel Glow Line */}
        <mesh position={[0, acrylicThickness / 2, baseDepth / 2 - 0.01]}>
          <boxGeometry args={[standWidth - 0.04, 0.015, 0.015]} />
          <meshStandardMaterial
            color={isWhite ? '#38bdf8' : '#f59e0b'}
            metalness={0.9}
            roughness={0.1}
            emissive={isWhite ? '#38bdf8' : '#d97706'}
            emissiveIntensity={0.45}
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
          color={isWhite ? '#f8f9fa' : '#16161a'}
          roughness={isWhite ? 0.35 : 0.08}
          transmission={isWhite ? 0.05 : 0}
          clearcoat={isWhite ? 0.1 : 1}
          clearcoatRoughness={isWhite ? 0.2 : 0.05}
          specularIntensity={1.0}
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
              roughness={0.35}
              transmission={0.05}
              opacity={0.98}
              transparent
              clearcoat={0.1}
              clearcoatRoughness={0.2}
              reflectivity={0.5}
              ior={1.5}
            />
          ) : (
            <meshPhysicalMaterial
              color="#16161a"
              roughness={0.14}
              metalness={0.12}
              clearcoat={1.0}
              clearcoatRoughness={0.06}
              reflectivity={0.9}
              specularIntensity={1.0}
              specularColor="#ffffff"
            />
          )}
        </mesh>

        {/* Polished Glass Edge Wire Highlight */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[standWidth + 0.01, faceHeight + 0.01, acrylicThickness]} />
          <meshStandardMaterial
            color={isWhite ? '#bae6fd' : '#f59e0b'}
            transparent
            opacity={isWhite ? 0.22 : 0.14}
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
        <group position={[0, -0.38, acrylicThickness / 2 + 0.006]}>
          <mesh ref={pulseRingRef}>
            <torusGeometry args={[0.22, 0.008, 16, 32]} />
            <meshStandardMaterial
              color="#fbbf24"
              metalness={0.9}
              roughness={0.1}
              transparent
              opacity={0.65}
              emissive="#f59e0b"
              emissiveIntensity={0.55}
            />
          </mesh>
          <mesh ref={pulseRing2Ref}>
            <torusGeometry args={[0.3, 0.005, 16, 32]} />
            <meshStandardMaterial
              color="#fef08a"
              metalness={0.8}
              roughness={0.2}
              transparent
              opacity={0.4}
              emissive="#eab308"
              emissiveIntensity={0.45}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
}

export default LStand3DModel;
