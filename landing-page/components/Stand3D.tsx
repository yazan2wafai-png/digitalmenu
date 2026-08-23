'use client';

import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, ContactShadows, Environment, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

export type StandTemplate = 'templateA' | 'templateB';

export interface Stand3DProps {
  white?: boolean;
  branding?: boolean;
  qrText?: string;
  logoText?: string;
  businessName?: string;
  showStars?: boolean;
  material?: string;
  template?: StandTemplate;
  autoRotate?: boolean;
  className?: string;
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
  fontSize: number = 62,
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
 * QR Code pattern drawing helper for Direct UV Screen Print
 */
function drawQRMatrix(
  ctx: CanvasRenderingContext2D,
  qrBoxX: number,
  qrBoxY: number,
  qrBoxSize: number,
  qrText: string,
  isWhite: boolean
) {
  const qrPadding = 22;
  const qrInnerX = qrBoxX + qrPadding;
  const qrInnerY = qrBoxY + qrPadding;
  const qrInnerSize = qrBoxSize - qrPadding * 2;
  const moduleCount = 25;
  const cellSize = qrInnerSize / moduleCount;

  // Background Box
  roundRect(ctx, qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 22);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 3.5;
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
 * EXACT DOREMUSIC DIRECT UV SCREEN PRINT DECAL GENERATOR FOR STAND3D
 * Transparent alpha background: meshPhysicalMaterial shines directly through behind ink!
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
  canvas.width = 1024;
  canvas.height = 1440;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // 1. Direct UV Print Physics: Clear transparent canvas (NO background card fill!)
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const primaryText = isWhite ? '#111827' : '#ffffff';
  const secondaryText = isWhite ? '#475569' : '#cbd5e1';
  const accentGold = '#f59e0b';

  // Subtle outer edge alignment hairline
  roundRect(ctx, 30, 30, canvas.width - 60, canvas.height - 60, 40);
  ctx.strokeStyle = isWhite ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // ═════════════════════════════════════════════════════════════
  // EXACT DOREMUSIC TURKISH PRINT LAYOUT
  // ═════════════════════════════════════════════════════════════
  const topBrandText = logoText || 'doremusic';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // 1. Top Brand / Logo Pill
  roundRect(ctx, 512 - 240, 58, 480, 64, 32);
  ctx.fillStyle = isWhite ? 'rgba(17, 24, 39, 0.08)' : 'rgba(251, 191, 36, 0.12)';
  ctx.fill();
  ctx.strokeStyle = accentGold;
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.font = '900 32px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = isWhite ? '#111827' : '#fbbf24';
  ctx.letterSpacing = '2.5px';
  ctx.fillText(topBrandText, 512, 90);

  // 2. Main Title: Line 1: "Google'da bizi" & Line 2: "değerlendirin"
  drawGoogleDaBizi(ctx, 512, 185, 60, primaryText);

  ctx.font = '800 46px "Google Sans", "Product Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = primaryText;
  ctx.letterSpacing = '0.5px';
  ctx.fillText('değerlendirin', 512, 250);

  // 4-Color Accent Line
  draw4ColorAccentLine(ctx, 512, 310, 520, 6);

  // 3. Middle Row: Clean QR Box (Left) + Prominent Circular NFC Badge (Right)
  const midRowY = 560;

  // Left QR Box
  const qrCenterX = 285;
  const qrSize = 260;
  const qrX = qrCenterX - qrSize / 2;
  const qrY = midRowY - qrSize / 2;

  ctx.font = '900 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = primaryText;
  ctx.textAlign = 'center';
  ctx.fillText('KODU TARAYIN', qrCenterX, qrY - 26);

  drawQRMatrix(ctx, qrX, qrY, qrSize, qrText, isWhite);

  ctx.font = '600 16px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillStyle = secondaryText;
  ctx.fillText('Kamera ile okutunuz', qrCenterX, qrY + qrSize + 28);

  // Center "VEYA" badge
  ctx.beginPath();
  ctx.arc(512, midRowY, 28, 0, Math.PI * 2);
  ctx.fillStyle = isWhite ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.08)';
  ctx.fill();
  ctx.strokeStyle = accentGold;
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.font = '900 16px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillStyle = accentGold;
  ctx.textAlign = 'center';
  ctx.fillText('VEYA', 512, midRowY);

  // Right Circular NFC Badge
  const nfcCenterX = 739;
  const nfcCenterY = midRowY;
  const nfcRadius = 125;

  ctx.font = '900 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = primaryText;
  ctx.textAlign = 'center';
  ctx.fillText('YAKLAŞTIRIN', nfcCenterX, qrY - 26);

  ctx.beginPath();
  ctx.arc(nfcCenterX, nfcCenterY, nfcRadius, 0, Math.PI * 2);
  ctx.fillStyle = isWhite ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.06)';
  ctx.fill();
  ctx.strokeStyle = accentGold;
  ctx.lineWidth = 4;
  ctx.stroke();

  // Golden wave arcs
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 4.5;
  ctx.lineCap = 'round';

  ctx.beginPath();
  ctx.arc(nfcCenterX, nfcCenterY, 34, -Math.PI * 0.75, Math.PI * 0.75);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(nfcCenterX, nfcCenterY, 62, -Math.PI * 0.75, Math.PI * 0.75);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(nfcCenterX, nfcCenterY, 90, -Math.PI * 0.75, Math.PI * 0.75);
  ctx.stroke();

  // Center NFC circle
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

  // 4. Body Text: Instruction Card
  const instructCardY = 845;
  const instructCardW = 860;
  const instructCardH = 138;
  const instructCardX = 512 - instructCardW / 2;

  roundRect(ctx, instructCardX, instructCardY, instructCardW, instructCardH, 24);
  ctx.fillStyle = isWhite ? 'rgba(17, 24, 39, 0.04)' : 'rgba(251, 191, 36, 0.06)';
  ctx.fill();
  ctx.strokeStyle = isWhite ? 'rgba(17, 24, 39, 0.15)' : 'rgba(251, 191, 36, 0.35)';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.font = '700 24px -apple-system, sans-serif';
  ctx.fillStyle = accentGold;
  ctx.fillText('✦', instructCardX + 42, instructCardY + 44);
  ctx.fillText('✨', instructCardX + instructCardW - 42, instructCardY + instructCardH - 40);

  ctx.font = '800 25px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = primaryText;
  ctx.textAlign = 'center';
  ctx.fillText(
    'Kodu tarayın veya telefonunuzu yaklaştırınız',
    512,
    instructCardY + 48
  );

  ctx.font = '700 23px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = isWhite ? '#b45309' : '#fbbf24';
  ctx.fillText(
    've ne düşündüğünüzü bize söyleyin.',
    512,
    instructCardY + 94
  );

  // 5. Bottom: Official Google 'G' Emblem + 5 Golden Stars ⭐⭐⭐⭐⭐
  const bottomBarY = 1040;
  const bottomBarW = 680;
  const bottomBarH = 116;
  const bottomBarX = 512 - bottomBarW / 2;

  roundRect(ctx, bottomBarX, bottomBarY, bottomBarW, bottomBarH, 32);
  ctx.fillStyle = isWhite ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.06)';
  ctx.fill();
  ctx.strokeStyle = isWhite ? '#cbd5e1' : 'rgba(251, 191, 36, 0.35)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Google G Icon Badge (Left)
  const gIconX = bottomBarX + 80;
  const gIconY = bottomBarY + bottomBarH / 2;
  drawGoogleGIcon(ctx, gIconX, gIconY, 56);

  // Vertical Separator
  ctx.strokeStyle = isWhite ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.15)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(gIconX + 54, bottomBarY + 22);
  ctx.lineTo(gIconX + 54, bottomBarY + bottomBarH - 22);
  ctx.stroke();

  // 5 Gold Stars (Right)
  const starCenterY = bottomBarY + bottomBarH / 2;
  const starStartX = gIconX + 110;
  const starSpacing = 48;
  for (let i = 0; i < 5; i++) {
    drawStar(ctx, starStartX + i * starSpacing, starCenterY, 5, 20, 9.5);
  }

  // Footer Powered by Tagline
  ctx.font = '600 15px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillStyle = isWhite ? '#94a3b8' : 'rgba(255, 255, 255, 0.7)';
  ctx.textAlign = 'center';
  ctx.fillText('⚡ Powered by NFCMyPlace® • Temassız Google Yorum Standı', 512, 1370);

  return canvas;
}

/**
 * Monolithic L-Stand 3D Model:
 * Exact physical alignment:
 * - Base foot rests flat on table (y = -1.5, extending backwards from z = +0.4 to z = -1.0)
 * - Upright tilted face starts directly from front edge of base foot (y = -1.46, z = +0.4)
 * - Tilted backward by 15° (75° elevation angle)
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

  // Exact Physical Dimension Ratios:
  const standWidth = 2.5;
  const baseDepth = 1.4;
  const faceHeight = 3.5;
  const acrylicThickness = 0.08;
  const frontEdgeZ = 0.4;
  const baseY = -1.5;
  const baseTopY = baseY + acrylicThickness / 2; // -1.46

  // 15° inclination angle from vertical for ergonomic 75° viewing angle
  const tiltAngle = (15 * Math.PI) / 180;

  // Center position of tilted face so bottom edge starts exactly at (0, baseTopY, frontEdgeZ)
  const faceCenterY = baseTopY + (faceHeight / 2) * Math.cos(tiltAngle);
  const faceCenterZ = frontEdgeZ - (faceHeight / 2) * Math.sin(tiltAngle);

  // Generate Decal Texture
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
                color="#f8f9fa"
                roughness={0.06}
                transmission={0.92}
                opacity={0.96}
                transparent
                clearcoat={1.0}
                clearcoatRoughness={0.05}
                reflectivity={0.9}
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

          {/* Front Bevel Accent Glow Line */}
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
          <cylinderGeometry args={[acrylicThickness / 2, acrylicThickness / 2, standWidth, 16]} />
          <meshPhysicalMaterial
            color={isWhite ? '#f8f9fa' : '#16161a'}
            roughness={0.08}
            transmission={isWhite ? 0.92 : 0}
            clearcoat={1}
            clearcoatRoughness={0.05}
            specularIntensity={1.0}
          />
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
                color="#f8f9fa"
                roughness={0.06}
                transmission={0.94}
                opacity={0.98}
                transparent
                clearcoat={1.0}
                clearcoatRoughness={0.05}
                reflectivity={0.9}
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

          {/* Polished Glass Refraction Wire Highlight */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[standWidth + 0.01, faceHeight + 0.01, acrylicThickness]} />
            <meshStandardMaterial
              color={isWhite ? '#bae6fd' : '#f59e0b'}
              transparent
              opacity={isWhite ? 0.22 : 0.14}
              wireframe
            />
          </mesh>

          {/* Dynamic Front Decal Canvas */}
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

          {/* 3D Pulsing Gold NFC Emission Rings over right-side NFC badge */}
          <group position={[0.58, -0.15, acrylicThickness / 2 + 0.006]}>
            <mesh ref={pulseRingRef}>
              <torusGeometry args={[0.18, 0.008, 16, 32]} />
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
              <torusGeometry args={[0.24, 0.005, 16, 32]} />
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

