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
  /** Accepted for API compatibility with existing callers; both templates
   * currently render the same clean layout below. */
  template?: StandTemplate;
}

/* ────────────────────────────────────────────────────────────────────
 * REAL-WORLD GEOMETRY
 *
 * A single sheet of acrylic, constant thickness, bent through 75°: a
 * flat foot resting on the table, a smooth radius bend, and an upright
 * face panel. Built as ONE continuous extruded THREE.Shape (not boxes
 * glued together), so the bend actually reads as bent acrylic.
 *
 * Scene scale: 40mm per Three.js unit - keeps the 100mm-wide stand at
 * the 2.5-unit footprint already used elsewhere on the site.
 * ──────────────────────────────────────────────────────────────────── */
const MM_PER_UNIT = 40;
const mm = (v: number) => v / MM_PER_UNIT;

const STAND_WIDTH_MM = 100;
const BASE_FOOT_MM = 60; // horizontal foot resting on the table
const FACE_LEN_MM = 150; // slant length of the upright face panel
const THICKNESS_MM = 3.5; // 3-4mm clear acrylic sheet
const BEND_ANGLE_DEG = 75; // the sheet turns through 75° at the bend
const BEND_RADIUS_MM = 6; // smooth thermo-bend radius
const BEVEL_MM = 0.35; // subtle bevel on the extruded outer edges
const ARC_SEGMENTS = 20;

const STAND_WIDTH_U = mm(STAND_WIDTH_MM);
// The face panel is tilted (90° - bend angle) off true vertical - fixed by
// the bend spec, not something that needs to be re-derived at runtime.
const TILT_FROM_VERTICAL_RAD = THREE.MathUtils.degToRad(90 - BEND_ANGLE_DEG);

interface LProfileLandmarks {
  shape: THREE.Shape;
  faceCenter: { z: number; y: number };
  faceLenU: number;
}

/**
 * Builds the closed 2D silhouette of the bent acrylic sheet - outer
 * (convex, "front") surface out, cap across the top of the face, inner
 * surface back, cap across the back of the foot - plus the landmark
 * point needed to place the decal plane flush against the outer face.
 *
 * Shape-space (x, y) maps 1:1 onto the mesh's local (Z, Y) once the
 * extrusion is rotated to run along X (see buildGeometry), so these
 * numbers double as world-space placement data for the decal.
 */
function buildLProfile(): LProfileLandmarks {
  const half = mm(THICKNESS_MM) / 2;
  const baseFoot = mm(BASE_FOOT_MM);
  const faceLen = mm(FACE_LEN_MM);
  const R = mm(BEND_RADIUS_MM);
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

function buildGeometry(shape: THREE.Shape): THREE.BufferGeometry {
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: STAND_WIDTH_U,
    bevelEnabled: true,
    bevelThickness: mm(BEVEL_MM),
    bevelSize: mm(BEVEL_MM),
    bevelSegments: 3,
    curveSegments: 1, // the bend arc is already densely pre-sampled via lineTo
  });
  // Extrude runs along Z by default; rotate so it runs along X (the
  // stand's width axis) and re-center it there.
  geo.rotateY(-Math.PI / 2);
  geo.translate(STAND_WIDTH_U / 2, 0, 0);
  geo.computeVertexNormals();
  return geo;
}

/* ────────────────────────────────────────────────────────────────────
 * FRONT-FACE DECAL (1000×1500 canvas mapped onto the upright face)
 * ──────────────────────────────────────────────────────────────────── */
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, outerR: number, innerR: number) {
  let rot = (Math.PI / 2) * 3;
  const step = Math.PI / 5;
  ctx.beginPath();
  ctx.moveTo(cx, cy - outerR);
  for (let i = 0; i < 5; i++) {
    ctx.lineTo(cx + Math.cos(rot) * outerR, cy + Math.sin(rot) * outerR);
    rot += step;
    ctx.lineTo(cx + Math.cos(rot) * innerR, cy + Math.sin(rot) * innerR);
    rot += step;
  }
  ctx.closePath();
  ctx.fillStyle = '#d4af37';
  ctx.fill();
  ctx.strokeStyle = '#92400e';
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

function createDecalTexture(
  businessName: string,
  logoText: string,
  qrText: string,
  showStars: boolean,
  isWhite: boolean,
  branding: boolean
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 1000;
  canvas.height = 1500;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const ink = isWhite ? '#1f2937' : '#ffffff';
  const gold = '#d4af37';
  const goldLight = '#e5c158';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  roundRect(ctx, 40, 60, 920, 1380, 28);
  ctx.strokeStyle = isWhite ? 'rgba(180, 83, 9, 0.5)' : 'rgba(229, 193, 88, 0.5)';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.font = '800 54px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = isWhite ? '#92400e' : goldLight;
  ctx.fillText(logoText, 500, 180);

  ctx.font = '700 46px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = ink;
  ctx.fillText("Google'da bizi", 500, 280);
  ctx.font = '800 50px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('değerlendirin', 500, 340);

  ctx.font = '600 30px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = isWhite ? 'rgba(31, 41, 55, 0.65)' : 'rgba(255, 255, 255, 0.65)';
  ctx.fillText(businessName, 500, 400);

  const qrSize = 430;
  const qrX = 500 - qrSize / 2;
  const qrY = 470;
  roundRect(ctx, qrX - 16, qrY - 16, qrSize + 32, qrSize + 32, 24);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.strokeStyle = gold;
  ctx.lineWidth = 5;
  ctx.stroke();

  let hash = 0;
  for (let i = 0; i < qrText.length; i++) {
    hash = (hash << 5) - hash + qrText.charCodeAt(i);
    hash |= 0;
  }
  const modules = 21;
  const cell = qrSize / modules;
  const drawFinder = (fx: number, fy: number) => {
    ctx.fillStyle = '#0a0a0c';
    ctx.fillRect(fx, fy, cell * 6, cell * 6);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(fx + cell, fy + cell, cell * 4, cell * 4);
    ctx.fillStyle = '#0a0a0c';
    ctx.fillRect(fx + cell * 2, fy + cell * 2, cell * 2, cell * 2);
  };
  drawFinder(qrX, qrY);
  drawFinder(qrX + (modules - 6) * cell, qrY);
  drawFinder(qrX, qrY + (modules - 6) * cell);
  ctx.fillStyle = '#0a0a0c';
  for (let r = 0; r < modules; r++) {
    for (let c = 0; c < modules; c++) {
      if (r < 7 && c < 7) continue;
      if (r < 7 && c >= modules - 7) continue;
      if (r >= modules - 7 && c < 7) continue;
      const seed = Math.sin(r * 29.3 + c * 19.7 + hash) * 10000;
      if (seed - Math.floor(seed) > 0.5) {
        ctx.fillRect(qrX + c * cell, qrY + r * cell, cell * 0.94, cell * 0.94);
      }
    }
  }

  if (showStars) {
    const starY = qrY + qrSize + 90;
    for (let i = 0; i < 5; i++) drawStar(ctx, 500 - 2 * 70 + i * 70, starY, 26, 12);
  }

  ctx.font = '600 26px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = isWhite ? '#b45309' : goldLight;
  ctx.fillText('Kodu tarayın veya telefonunuzu yaklaştırın', 500, qrY + qrSize + 150);

  if (branding) {
    ctx.font = '600 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = isWhite ? 'rgba(100, 116, 139, 0.8)' : 'rgba(255, 255, 255, 0.55)';
    ctx.fillText('⚡ Powered by NFCMyPlace®', 500, 1420);
  }

  return canvas;
}

/* ────────────────────────────────────────────────────────────────────
 * COMPONENT
 * ──────────────────────────────────────────────────────────────────── */
export function LStand3DModel({
  white = false,
  logoText = 'doremusic',
  businessName = 'doremusic Akasya AVM',
  qrText = 'g.page/r/doremusic',
  showStars = true,
  material = 'crystal',
  isHovered = false,
  branding = true,
}: LStandModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const pulseRingRef = useRef<THREE.Mesh>(null);
  const pulseRing2Ref = useRef<THREE.Mesh>(null);

  const isWhite = white || material === 'crystal' || material === 'white';

  const landmarks = useMemo(() => buildLProfile(), []);
  const geometry = useMemo(() => buildGeometry(landmarks.shape), [landmarks]);
  useEffect(() => () => geometry.dispose(), [geometry]);

  const decalTexture = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const canvas = createDecalTexture(businessName, logoText, qrText, showStars, isWhite, branding);
    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 16;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }, [businessName, logoText, qrText, showStars, isWhite, branding]);

  useEffect(() => {
    return () => {
      decalTexture?.dispose();
    };
  }, [decalTexture]);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (pulseRingRef.current) pulseRingRef.current.scale.setScalar(1 + Math.sin(t * 3.5) * 0.08);
    if (pulseRing2Ref.current) pulseRing2Ref.current.scale.setScalar(1 + Math.cos(t * 3.5) * 0.06);
    if (groupRef.current) {
      const targetScale = isHovered ? 1.03 : 1;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 5);
    }
  });

  // Outward normal of the tilted face (derived from the fixed bend
  // geometry, not recomputed per-frame): mostly +Z (toward the viewer)
  // with a small -Y component from the forward lean.
  const decalNormalOffset = mm(THICKNESS_MM) / 2 + 0.006;
  const decalWidth = STAND_WIDTH_U * 0.92;
  const decalHeight = landmarks.faceLenU * 0.9;
  const decalPos: [number, number, number] = [
    0,
    landmarks.faceCenter.y - Math.sin(TILT_FROM_VERTICAL_RAD) * decalNormalOffset,
    landmarks.faceCenter.z + Math.cos(TILT_FROM_VERTICAL_RAD) * decalNormalOffset,
  ];
  const ringGroupPos: [number, number, number] = [
    0,
    landmarks.faceCenter.y - landmarks.faceLenU * 0.32,
    landmarks.faceCenter.z + Math.cos(TILT_FROM_VERTICAL_RAD) * decalNormalOffset * 1.4,
  ];

  return (
    <group ref={groupRef} position={[0, -1.5, 0]}>
      {/* Monolithic bent-acrylic body - one extruded L-profile mesh */}
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshPhysicalMaterial
          color={isWhite ? '#f4f4f5' : '#0d0d0f'}
          transmission={0.9}
          roughness={0.08}
          ior={1.49}
          thickness={1.2}
          reflectivity={0.9}
          transparent
          clearcoat={0.4}
          clearcoatRoughness={0.08}
        />
      </mesh>

      {/* Front-face decal - 1000x1500 canvas mapped onto the 75° face */}
      {decalTexture && (
        <mesh position={decalPos} rotation={[TILT_FROM_VERTICAL_RAD, 0, 0]}>
          <planeGeometry args={[decalWidth, decalHeight]} />
          <meshStandardMaterial
            map={decalTexture}
            transparent
            roughness={0.2}
            metalness={0.05}
            polygonOffset
            polygonOffsetFactor={-1}
          />
        </mesh>
      )}

      {/* NFC emission pulse rings */}
      <group position={ringGroupPos}>
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
  );
}

export default LStand3DModel;
