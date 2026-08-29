'use client';

import React, { useRef, useState, useMemo, useEffect, useLayoutEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, ContactShadows, Environment, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Cubic ease-in-out - used for every color/scale/shadow transition below so
 * the black<->white swap reads as one consistent, non-bouncy motion language.
 */
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Shared acrylic body material presets (base foot / front corner / face slab). */
const ACRYLIC_BLACK = {
  color: new THREE.Color('#0d0d0f'),
  roughness: 0.2,
  metalness: 0.04,
  clearcoat: 0.55,
  clearcoatRoughness: 0.12,
  transmission: 0,
  opacity: 1,
  specularIntensity: 0.75,
};
const ACRYLIC_WHITE = {
  color: new THREE.Color('#f4f4f5'),
  roughness: 0.24,
  metalness: 0,
  clearcoat: 0.4,
  clearcoatRoughness: 0.14,
  transmission: 0.03,
  opacity: 0.98,
  specularIntensity: 0.85,
};

/** Bevel accent line: warm gold (black body) <-> cool cyan (white body). */
const BEVEL_BLACK = { color: new THREE.Color('#e5c158'), emissive: new THREE.Color('#d4af37') };
const BEVEL_WHITE = { color: new THREE.Color('#38bdf8'), emissive: new THREE.Color('#38bdf8') };

/* ────────────────────────────────────────────────────────────────────
 * REAL BENT-ACRYLIC BODY GEOMETRY
 *
 * A single sheet of acrylic, constant thickness, bent through 75°: a
 * flat foot resting on the table, a smooth radius bend, and an upright
 * face panel - built as ONE continuous extruded THREE.Shape (not the
 * three separate box/cylinder pieces this used to be glued from).
 *
 * Scene scale: 40mm per Three.js unit (matches the pre-existing
 * standWidth=2.5 / faceHeight=3.75 convention below, which is exactly
 * 100mm / 150mm at this scale).
 * ──────────────────────────────────────────────────────────────────── */
const MM_PER_UNIT = 40;
const mmToUnits = (v: number) => v / MM_PER_UNIT;

const STAND_WIDTH_MM = 100;
const BASE_FOOT_MM = 60; // horizontal foot resting on the table
const FACE_LEN_MM = 150; // slant length of the upright face panel
const THICKNESS_MM = 3.5; // 3-4mm clear acrylic sheet
const BEND_ANGLE_DEG = 75; // the sheet turns through 75° at the bend
const BEND_RADIUS_MM = 6; // smooth thermo-bend radius
const BEVEL_MM = 0.35; // subtle bevel on the extruded outer edges
const ARC_SEGMENTS = 20;

const STAND_WIDTH_U = mmToUnits(STAND_WIDTH_MM);
const BASE_FOOT_U = mmToUnits(BASE_FOOT_MM);
const THICKNESS_U = mmToUnits(THICKNESS_MM);
// Fixed by the bend spec (turns through 75°), not re-derived at runtime.
const TILT_FROM_VERTICAL_RAD = THREE.MathUtils.degToRad(90 - BEND_ANGLE_DEG);

interface LProfileLandmarks {
  shape: THREE.Shape;
  faceCenter: { z: number; y: number };
  faceLenU: number;
}

/**
 * Builds the closed 2D silhouette of the bent acrylic sheet (outer/convex
 * "front" surface out, cap across the top of the face, inner surface
 * back, cap across the back of the foot) plus the landmark point needed
 * to place the decal + NFC rings flush against the outer face. Shape
 * space (x, y) maps 1:1 onto the mesh's local (Z, Y) once the extrusion
 * is rotated to run along X (see buildStandBodyGeometry below).
 */
function buildLProfile(): LProfileLandmarks {
  const half = THICKNESS_U / 2;
  const baseFoot = BASE_FOOT_U;
  const faceLen = mmToUnits(FACE_LEN_MM);
  const R = mmToUnits(BEND_RADIUS_MM);
  const bendAngleRad = THREE.MathUtils.degToRad(BEND_ANGLE_DEG);

  const centerline: THREE.Vector2[] = [
    new THREE.Vector2(-baseFoot, half),
    new THREE.Vector2(0, half),
  ];
  const tangents: THREE.Vector2[] = [new THREE.Vector2(1, 0), new THREE.Vector2(1, 0)];

  const arcCenter = new THREE.Vector2(0, half + R);
  for (let i = 1; i <= ARC_SEGMENTS; i++) {
    const theta = -Math.PI / 2 + (bendAngleRad * i) / ARC_SEGMENTS;
    centerline.push(new THREE.Vector2(arcCenter.x + R * Math.cos(theta), arcCenter.y + R * Math.sin(theta)));
    tangents.push(new THREE.Vector2(-Math.sin(theta), Math.cos(theta)));
  }

  const bendEnd = centerline[centerline.length - 1].clone();
  const faceTangent = tangents[tangents.length - 1].clone();
  const faceTop = bendEnd.clone().addScaledVector(faceTangent, faceLen);
  centerline.push(faceTop);
  tangents.push(faceTangent);

  const normals = tangents.map((t) => new THREE.Vector2(-t.y, t.x));
  const outer = centerline.map((p, i) => p.clone().addScaledVector(normals[i], -half));
  const inner = centerline.map((p, i) => p.clone().addScaledVector(normals[i], half));

  const shape = new THREE.Shape();
  shape.moveTo(outer[0].x, outer[0].y);
  outer.slice(1).forEach((p) => shape.lineTo(p.x, p.y));
  [...inner].reverse().forEach((p) => shape.lineTo(p.x, p.y));
  shape.closePath();

  const faceMid = bendEnd.clone().addScaledVector(faceTangent, faceLen / 2);

  return {
    shape,
    faceCenter: { z: faceMid.x, y: faceMid.y },
    faceLenU: faceLen,
  };
}

function buildStandBodyGeometry(shape: THREE.Shape): THREE.BufferGeometry {
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: STAND_WIDTH_U,
    bevelEnabled: true,
    bevelThickness: mmToUnits(BEVEL_MM),
    bevelSize: mmToUnits(BEVEL_MM),
    bevelSegments: 3,
    curveSegments: 1, // the bend arc is already densely pre-sampled via lineTo
  });
  geo.rotateY(-Math.PI / 2);
  geo.translate(STAND_WIDTH_U / 2, 0, 0);
  geo.computeVertexNormals();
  return geo;
}

/**
 * Eases a 0/1 target value over `duration` seconds using the R3F clock, so a
 * prop flip (e.g. isWhite) becomes a smooth ~300ms transition instead of an
 * instant snap. Returns refs (not state) so the per-frame write costs nothing
 * beyond a couple of lerps, and the internal useFrame subscription no-ops
 * (single boolean check) once the transition has settled.
 */
function useColorTransition(target: number, duration = 0.28) {
  const blend = useRef(target);
  const progress = useRef(1);
  const active = useRef(false);
  const fromVal = useRef(target);
  const toVal = useRef(target);
  const startTime = useRef<number | null>(null);
  const prevTarget = useRef(target);

  useEffect(() => {
    if (prevTarget.current !== target) {
      fromVal.current = blend.current;
      toVal.current = target;
      prevTarget.current = target;
      startTime.current = null;
      active.current = true;
    }
  }, [target]);

  useFrame((state) => {
    if (!active.current) return;
    if (startTime.current === null) startTime.current = state.clock.elapsedTime;
    const elapsed = state.clock.elapsedTime - startTime.current;
    const rawT = Math.min(elapsed / duration, 1);
    progress.current = rawT;
    blend.current = THREE.MathUtils.lerp(fromVal.current, toVal.current, easeInOutCubic(rawT));
    if (rawT >= 1) {
      active.current = false;
      startTime.current = null;
    }
  });

  return { blend, progress, active };
}

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
  // Bug fix: isWhite was previously accepted but never used, so the brand name/note
  // rendered in light gold on the white acrylic body with ~1.7:1 contrast (illegible).
  const brandFill = isWhite ? '#92400e' : goldGrad;

  ctx.font = '800 86px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif';
  const textWidth = ctx.measureText(brandText).width;
  const noteW = 80;
  const gap = 32;
  const totalW = noteW + gap + textWidth;
  const startX = cx - totalW / 2;

  // Vector double-beamed musical note (♫)
  const noteX = startX + 32;
  const noteY = cy;

  ctx.fillStyle = brandFill;
  ctx.strokeStyle = brandFill;
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
  ctx.fillStyle = brandFill;
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
  ctx.fillStyle = isWhite ? '#92400e' : primaryGold;
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

  // Premium color-swap: single materials whose props are eased between the
  // black/white presets (no more instant ternary unmount/remount), plus a
  // matching subtle "breathe" scale pulse on the whole stand.
  const bodyMatRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const bevelMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const colorTransition = useColorTransition(isWhite ? 1 : 0, 0.28);
  const tmpAcrylicColor = useRef(new THREE.Color());
  const tmpBevelColor = useRef(new THREE.Color());
  const tmpBevelEmissive = useRef(new THREE.Color());

  const applyMaterialBlend = () => {
    const t = colorTransition.blend.current;
    const acrylicColor = tmpAcrylicColor.current.copy(ACRYLIC_BLACK.color).lerp(ACRYLIC_WHITE.color, t);
    const roughness = THREE.MathUtils.lerp(ACRYLIC_BLACK.roughness, ACRYLIC_WHITE.roughness, t);
    const metalness = THREE.MathUtils.lerp(ACRYLIC_BLACK.metalness, ACRYLIC_WHITE.metalness, t);
    const clearcoat = THREE.MathUtils.lerp(ACRYLIC_BLACK.clearcoat, ACRYLIC_WHITE.clearcoat, t);
    const clearcoatRoughness = THREE.MathUtils.lerp(ACRYLIC_BLACK.clearcoatRoughness, ACRYLIC_WHITE.clearcoatRoughness, t);
    const transmission = THREE.MathUtils.lerp(ACRYLIC_BLACK.transmission, ACRYLIC_WHITE.transmission, t);
    const opacity = THREE.MathUtils.lerp(ACRYLIC_BLACK.opacity, ACRYLIC_WHITE.opacity, t);
    const specularIntensity = THREE.MathUtils.lerp(ACRYLIC_BLACK.specularIntensity, ACRYLIC_WHITE.specularIntensity, t);

    const bodyMat = bodyMatRef.current;
    if (bodyMat) {
      bodyMat.color.copy(acrylicColor);
      bodyMat.roughness = roughness;
      bodyMat.metalness = metalness;
      bodyMat.clearcoat = clearcoat;
      bodyMat.clearcoatRoughness = clearcoatRoughness;
      bodyMat.transmission = transmission;
      bodyMat.opacity = opacity;
      bodyMat.specularIntensity = specularIntensity;
    }

    const bevelColor = tmpBevelColor.current.copy(BEVEL_BLACK.color).lerp(BEVEL_WHITE.color, t);
    const bevelEmissive = tmpBevelEmissive.current.copy(BEVEL_BLACK.emissive).lerp(BEVEL_WHITE.emissive, t);
    if (bevelMatRef.current) {
      bevelMatRef.current.color.copy(bevelColor);
      bevelMatRef.current.emissive.copy(bevelEmissive);
    }
  };

  // Paint the correct initial state immediately (no black-then-white flash
  // on first mount when `white` starts true).
  useLayoutEffect(() => {
    applyMaterialBlend();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Real bent-acrylic dimensions (60mm foot, 150mm face, 3.5mm sheet,
  // smooth 75° bend) - see buildLProfile()/buildStandBodyGeometry() above.
  const landmarks = useMemo(() => buildLProfile(), []);
  const bodyGeometry = useMemo(() => buildStandBodyGeometry(landmarks.shape), [landmarks]);
  useEffect(() => () => bodyGeometry.dispose(), [bodyGeometry]);

  const standWidth = STAND_WIDTH_U;
  const faceHeight = landmarks.faceLenU;
  const baseDepth = BASE_FOOT_U;
  const acrylicThickness = THICKNESS_U;
  const frontEdgeZ = 0.4;
  const baseY = -1.5;
  const baseTopY = baseY + acrylicThickness / 2;

  // Fixed by the 75° bend spec (90° - 75° = 15° off true vertical).
  const tiltAngle = TILT_FROM_VERTICAL_RAD;

  // Exact center of the upright face, taken from the real bend geometry
  // above (not re-derived with a sharp-corner approximation).
  const faceCenterY = baseY + landmarks.faceCenter.y;
  const faceCenterZ = frontEdgeZ + landmarks.faceCenter.z;

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

    // Only touch material uniforms while an actual color transition is in
    // flight - once settled this branch is skipped entirely (zero idle cost).
    if (colorTransition.active.current) {
      applyMaterialBlend();
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

    // Subtle "breathe" pulse in sync with the color swap: eases up to a
    // ~1.8% scale bump at the midpoint of the transition and back to 1,
    // never bouncy/springy - just a soft sine hump over the same window.
    if (colorTransition.progress.current < 1) {
      const breathe = 1 + Math.sin(Math.min(colorTransition.progress.current, 1) * Math.PI) * 0.018;
      groupRef.current.scale.setScalar(breathe);
    } else if (groupRef.current.scale.x !== 1) {
      groupRef.current.scale.setScalar(1);
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
            MONOLITHIC BENT ACRYLIC BODY - one continuous extruded
            L-profile (60mm foot, smooth 75° bend, 150mm face) instead
            of three separate box/cylinder approximations.
            ────────────────────────────────────────────────────────── */}
        <mesh geometry={bodyGeometry} castShadow receiveShadow position={[0, baseY, frontEdgeZ]}>
          <meshPhysicalMaterial
            ref={bodyMatRef}
            color="#0d0d0f"
            roughness={0.2}
            metalness={0.04}
            clearcoat={0.55}
            clearcoatRoughness={0.12}
            transmission={0}
            opacity={1}
            transparent
            reflectivity={0.5}
            ior={1.5}
            specularIntensity={0.75}
            specularColor="#ffffff"
          />
        </mesh>

        {/* Bevel Accent Glow Line - sits right along the bend crease */}
        <mesh position={[0, baseTopY, frontEdgeZ - 0.03]}>
          <boxGeometry args={[standWidth - 0.04, 0.015, 0.015]} />
          <meshStandardMaterial
            ref={bevelMatRef}
            color="#e5c158"
            metalness={0.9}
            roughness={0.1}
            emissive="#d4af37"
            emissiveIntensity={0.45}
          />
        </mesh>

        {/* 4 Non-Slip Silicone Resting Foot Pads */}
        <group position={[0, baseY, frontEdgeZ - baseDepth / 2]}>
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
            DECAL + NFC PULSE RINGS - positioned flush on the tilted
            face, independent of the body mesh above.
            ────────────────────────────────────────────────────────── */}
        <group position={[0, faceCenterY, faceCenterZ]} rotation={[-tiltAngle, 0, 0]}>
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
 * Eases ContactShadows opacity/blur (and a touch of ambient intensity)
 * between the black-body and white-body presets over the same ~300ms
 * window as the material swap, using a plain rAF loop (this lives outside
 * the R3F render tree, driven by regular React state) so idle frames after
 * the transition settles cost nothing extra.
 */
function useAnimatedShadowProps(isWhite: boolean, duration = 300) {
  const BLACK_PRESET = { opacity: 0.65, blur: 2.2, ambient: 0.85 };
  const WHITE_PRESET = { opacity: 0.45, blur: 3.0, ambient: 0.92 };

  const [props, setProps] = useState(isWhite ? WHITE_PRESET : BLACK_PRESET);
  const fromRef = useRef(isWhite ? WHITE_PRESET : BLACK_PRESET);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const from = fromRef.current;
    const to = isWhite ? WHITE_PRESET : BLACK_PRESET;
    const start = performance.now();
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);

    const tick = (now: number) => {
      const raw = Math.min((now - start) / duration, 1);
      const eased = easeInOutCubic(raw);
      const next = {
        opacity: from.opacity + (to.opacity - from.opacity) * eased,
        blur: from.blur + (to.blur - from.blur) * eased,
        ambient: from.ambient + (to.ambient - from.ambient) * eased,
      };
      setProps(next);
      if (raw < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = to;
        rafRef.current = null;
      }
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWhite]);

  return props;
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
  const shadowProps = useAnimatedShadowProps(Boolean(white));

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
      {/* ── HIGH-END STUDIO LIGHTING RIG ──
          Note: the stand spins continuously (groupRef rotation.y) while these
          lights stay fixed in world space, so every angle needs enough
          coverage on its own - not just the front-on hero angle. Ambient +
          rim/fill are kept high enough that the black acrylic never goes flat
          or dark as it rotates past the key light. */}
      <ambientLight intensity={shadowProps.ambient} />

      {/* Main Warm Key Light */}
      <directionalLight
        position={[4, 7, 5]}
        intensity={2.1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0001}
        color="#fffbf0"
      />

      {/* Cyan Rim Silhouette Light (Highlights Back & Side Edges of Black Acrylic) */}
      <directionalLight
        position={[-6, 4, -4]}
        intensity={1.3}
        color="#38bdf8"
      />

      {/* Cool White Secondary Rim Light */}
      <directionalLight
        position={[6, -2, -4]}
        intensity={1.1}
        color="#e0f2fe"
      />

      {/* Warm Golden Bottom Fill Light (Illuminates the Base Foot) */}
      <pointLight
        position={[0, -2.2, 3.5]}
        intensity={1.6}
        color="#fbbf24"
        distance={9}
      />

      {/* High-Key Top Spot */}
      <spotLight
        position={[0, 8, 2]}
        intensity={1.3}
        angle={0.7}
        penumbra={0.8}
        color="#ffffff"
      />

      {/* Studio Reflection Environment */}
      <Environment preset="studio" />

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
        opacity={shadowProps.opacity}
        scale={9}
        blur={shadowProps.blur}
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

