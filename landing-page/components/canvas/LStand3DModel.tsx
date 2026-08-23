'use client';
import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export type StandMaterialType = 'walnut' | 'oak' | 'black' | 'crystal' | 'white';

export interface LStandModelProps {
  white?: boolean;
  logoText?: string;
  businessName?: string;
  qrText?: string;
  showStars?: boolean;
  material?: StandMaterialType | string;
  isHovered?: boolean;
  branding?: boolean;
}

/**
 * Draws the official multicolored Google logo wordmark (Google) with correct branding colors:
 * G (Blue #4285F4), o (Red #EA4335), o (Yellow #FBBC05), g (Blue #4285F4), l (Green #34A853), e (Red #EA4335)
 */
function drawGoogleWordmark(ctx: CanvasRenderingContext2D, cx: number, cy: number, fontSize: number = 72) {
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
 * Draws the 4-Color Accent Line (Blue #4285F4, Red #EA4335, Yellow #FBBC05, Green #34A853)
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
 * Draws a rounded rectangle path helper
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
 * Generates the full high-res canvas decal matching the dual Black & White reference layout:
 * - Top: "Review us on" + Multicolored "Google" + 5 Gold Stars + 4-Color Accent Line
 * - Middle Row: Left "TAP ME" (phone icon) | "OR" | Right "SCAN QR" (QR matrix box)
 * - Footer: Dynamic Logo Pill, Business Name Pill, "Powered by NFCMyPlace", and NFC Wave Icon
 */
function createDualColorLStandDecal(
  isWhite: boolean,
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

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Colors based on variant
  const primaryText = isWhite ? '#0f172a' : '#ffffff';
  const secondaryText = isWhite ? '#475569' : '#cbd5e1';
  const accentGold = '#f59e0b';
  const qrBoxBg = '#ffffff'; // Always crisp high contrast white container for QR
  const qrModuleColor = '#0a0a0c';

  // Card Body Background
  roundRect(ctx, 24, 24, canvas.width - 48, canvas.height - 48, 40);
  if (isWhite) {
    // Glossy Frost White Background
    ctx.fillStyle = '#f8f9fa';
    ctx.fill();
    ctx.strokeStyle = 'rgba(203, 213, 225, 0.8)';
    ctx.lineWidth = 4;
    ctx.stroke();
  } else {
    // Deep Piano Satin Black Background
    ctx.fillStyle = '#0d0d0e';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.09)';
    ctx.lineWidth = 4;
    ctx.stroke();
  }

  // ─────────────────────────────────────────────────────────────
  // 1. TOP HEADER: "Review us on" + Multicolored "Google"
  // ─────────────────────────────────────────────────────────────
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '700 36px "Google Sans", "Product Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = primaryText;
  ctx.letterSpacing = '0.5px';
  ctx.fillText('Review us on', 512, 105);

  // Multicolored Google Wordmark
  drawGoogleWordmark(ctx, 512, 175, 78);

  // 5 Gold Stars
  if (showStars) {
    const starY = 250;
    const starSpacing = 44;
    const startX = 512 - 2 * starSpacing;
    for (let i = 0; i < 5; i++) {
      drawStar(ctx, startX + i * starSpacing, starY, 5, 18, 8.5);
    }
  }

  // 4-Color Accent Line (Blue, Red, Yellow, Green)
  draw4ColorAccentLine(ctx, 512, 305, 580, 7);

  // ─────────────────────────────────────────────────────────────
  // 2. MIDDLE ROW: "TAP ME" (Left) | "OR" (Center) | "SCAN QR" (Right)
  // ─────────────────────────────────────────────────────────────
  const midRowY = 560;

  // ── LEFT: "TAP ME" ──
  const tapCenterX = 280;

  // Phone Frame Icon
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

  // Screen inner
  roundRect(ctx, phoneX + 8, phoneY + 12, phoneW - 16, phoneH - 24, 8);
  ctx.fillStyle = isWhite ? '#ffffff' : '#0d0d10';
  ctx.fill();

  // Phone NFC waves on top of phone
  ctx.strokeStyle = accentGold;
  ctx.lineWidth = 3.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(tapCenterX, phoneY - 12, 18, -Math.PI * 0.75, -Math.PI * 0.25);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(tapCenterX, phoneY - 12, 32, -Math.PI * 0.75, -Math.PI * 0.25);
  ctx.stroke();

  // "TAP ME" Text
  ctx.font = '900 36px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = primaryText;
  ctx.textAlign = 'center';
  ctx.fillText('TAP ME', tapCenterX, midRowY + 50);

  ctx.font = '600 18px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillStyle = secondaryText;
  ctx.fillText('Touch phone here', tapCenterX, midRowY + 86);

  // ── CENTER DIVIDER: "OR" ──
  const orCenterX = 512;
  const orCenterY = midRowY;

  // Subtle circular badge for "OR"
  ctx.beginPath();
  ctx.arc(orCenterX, orCenterY, 32, 0, Math.PI * 2);
  ctx.fillStyle = isWhite ? '#e2e8f0' : '#1e1e24';
  ctx.fill();
  ctx.strokeStyle = accentGold;
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.font = '900 22px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillStyle = accentGold;
  ctx.textAlign = 'center';
  ctx.fillText('OR', orCenterX, orCenterY);

  // ── RIGHT: "SCAN QR" ──
  const qrCenterX = 744;
  const qrBoxSize = 250;
  const qrBoxX = qrCenterX - qrBoxSize / 2;
  const qrBoxY = midRowY - 145;

  // "SCAN QR" Header above QR box
  ctx.font = '900 34px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = primaryText;
  ctx.textAlign = 'center';
  ctx.fillText('SCAN QR', qrCenterX, qrBoxY - 26);

  // High contrast white QR container card
  roundRect(ctx, qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 20);
  ctx.fillStyle = qrBoxBg;
  ctx.fill();
  ctx.strokeStyle = accentGold;
  ctx.lineWidth = 3.5;
  ctx.stroke();

  // QR Pattern Matrix
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

  ctx.fillStyle = qrModuleColor;

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

  // QR Center Google 'G' Badge
  const qrLogoSize = cellSize * 5.5;
  const qrLogoCenterX = qrInnerX + qrInnerSize / 2;
  const qrLogoCenterY = qrInnerY + qrInnerSize / 2;
  roundRect(ctx, qrLogoCenterX - qrLogoSize / 2, qrLogoCenterY - qrLogoSize / 2, qrLogoSize, qrLogoSize, 8);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Mini Google G in center
  ctx.font = '800 24px "Product Sans", sans-serif';
  ctx.fillStyle = '#4285F4';
  ctx.textAlign = 'center';
  ctx.fillText('G', qrLogoCenterX, qrLogoCenterY + 1);

  // Subtitle below QR
  ctx.font = '600 16px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillStyle = secondaryText;
  ctx.textAlign = 'center';
  ctx.fillText('Use camera to scan', qrCenterX, qrBoxY + qrBoxSize + 28);

  // ─────────────────────────────────────────────────────────────
  // 3. HORIZONTAL DIVIDER
  // ─────────────────────────────────────────────────────────────
  ctx.strokeStyle = isWhite ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.1)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(90, 890);
  ctx.lineTo(934, 890);
  ctx.stroke();

  // ─────────────────────────────────────────────────────────────
  // 4. CUSTOMIZABLE FOOTER: LOGO PILL + BUSINESS PILL + POWERED BY + NFC
  // ─────────────────────────────────────────────────────────────
  const footerX = 90;
  const footerY = 940;
  const pillWidth = 560;

  // 1st Pill: Logo / Brand Badge
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
  ctx.fillText(logoText || 'Your Logo', footerX + pillWidth / 2, footerY + 37);

  // 2nd Pill: Business Name Badge (Optional)
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
    ctx.strokeStyle = 'rgba(255,255,255,0.14)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  ctx.font = '700 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = isWhite ? '#334155' : '#e2e8f0';
  ctx.textAlign = 'center';
  ctx.fillText(businessName || 'Business Name (Optional)', footerX + pillWidth / 2, subPillY + 34);

  // Small "Powered by NFCMyPlace" Tagline
  ctx.font = '600 16px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillStyle = isWhite ? '#94a3b8' : '#71717a';
  ctx.textAlign = 'left';
  ctx.fillText('⚡ Powered by NFCMyPlace', footerX + 12, subPillY + 104);

  // Bottom-Right Corner: Contactless NFC Wave Icon in Circle Badge
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

  // Golden contactless wave arcs
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
  logoText = 'Your Logo',
  businessName = 'Business Name (Optional)',
  qrText = 'nfcmyplace.com',
  showStars = true,
  material = 'crystal',
  isHovered = false,
  branding = true,
}: LStandModelProps) {
  const pulseRingRef = useRef<THREE.Mesh>(null);
  const pulseRing2Ref = useRef<THREE.Mesh>(null);

  const isWhite = white || material === 'crystal' || material === 'white';

  // Generate dual-color decal canvas texture
  const decalTexture = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const canvas = createDualColorLStandDecal(isWhite, logoText, businessName, qrText, showStars);
    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 16;
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.needsUpdate = true;
    return texture;
  }, [isWhite, logoText, businessName, qrText, showStars]);

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

  // 15° inclination angle for authentic L-Stand ergonomic 75° viewing
  const tiltAngle = (15 * Math.PI) / 180;

  return (
    <group position={[0, -0.4, 0]}>
      {/* ──────────────────────────────────────────────────────────
          1. MONOLITHIC ACRYLIC L-STAND RESTING FOOT (BASE)
          ────────────────────────────────────────────────────────── */}
      <group position={[0, -1.35, 0.4]}>
        {/* Flat Bottom Resting Foot */}
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[2.5, 0.09, 0.95]} />
          {isWhite ? (
            <meshPhysicalMaterial
              color="#f8f9fa"
              transmission={0.94}
              opacity={0.96}
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
              roughness={0.2}
              metalness={0.15}
              clearcoat={0.6}
              clearcoatRoughness={0.1}
              specularIntensity={0.8}
            />
          )}
        </mesh>

        {/* Front Edge Bevel Glow Line */}
        <mesh position={[0, 0.045, 0.47]}>
          <boxGeometry args={[2.48, 0.02, 0.02]} />
          <meshStandardMaterial
            color={isWhite ? '#38bdf8' : '#f59e0b'}
            metalness={0.9}
            roughness={0.1}
            emissive={isWhite ? '#38bdf8' : '#d97706'}
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* Non-Slip Silicone Resting Bumpers */}
        {[-1.05, 1.05].flatMap((x) =>
          [-0.35, 0.35].map((z, i) => (
            <mesh key={`${x}-${z}-${i}`} position={[x, -0.055, z]}>
              <cylinderGeometry args={[0.06, 0.06, 0.02, 16]} />
              <meshStandardMaterial color="#111111" roughness={0.9} />
            </mesh>
          ))
        )}
      </group>

      {/* ──────────────────────────────────────────────────────────
          2. SEAMLESS 75° ANGLED VERTICAL FRONT ACRYLIC FACE (L-STAND)
          ────────────────────────────────────────────────────────── */}
      <group position={[0, 0.3, -0.05]} rotation={[-tiltAngle, 0, 0]}>
        {/* Monolithic Acrylic Slab Body */}
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[2.5, 3.4, 0.09]} />
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

        {/* Polished Glass Refraction Edge Border */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2.52, 3.42, 0.08]} />
          <meshStandardMaterial
            color={isWhite ? '#bae6fd' : '#f59e0b'}
            transparent
            opacity={isWhite ? 0.25 : 0.15}
            wireframe
          />
        </mesh>

        {/* ────────────────────────────────────────────────────────
            3. HIGH-RESOLUTION DYNAMIC DECAL FRONT MESH
            ──────────────────────────────────────────────────────── */}
        {decalTexture && (
          <mesh position={[0, 0, 0.047]}>
            <planeGeometry args={[2.42, 3.32]} />
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
            4. 3D GOLD FOIL PULSING NFC EMISSION RINGS (BOTTOM RIGHT)
            ──────────────────────────────────────────────────────── */}
        <group position={[0.72, -1.15, 0.052]}>
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
