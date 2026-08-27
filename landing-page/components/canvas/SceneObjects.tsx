'use client';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { LStand3DModel, type StandMaterialType } from './LStand3DModel';

export interface TableStandProps {
  isHovered?: boolean;
  material?: StandMaterialType | string;
  white?: boolean;
  branding?: boolean;
  logoText?: string;
  businessName?: string;
  qrText?: string;
  showStars?: boolean;
  template?: 'templateA' | 'templateB';
}

// ── 1. AUTHENTIC 3D L-STAND TABLE MODEL ──
export function TableStand({
  isHovered = false,
  material = 'crystal',
  white = false,
  branding = true,
  logoText = 'Your Logo',
  businessName = 'Business Name (Optional)',
  qrText = 'nfcmyplace.com',
  showStars = true,
  template = 'templateA',
}: TableStandProps) {
  return (
    <LStand3DModel
      white={white}
      branding={branding}
      logoText={logoText}
      businessName={businessName}
      qrText={qrText}
      showStars={showStars}
      material={material}
      isHovered={isHovered}
      template={template}
    />
  );
}

export interface GoogleReviewCardProps {
  isHovered?: boolean;
}

// ── 2. MATTE BLACK & GOLD FOIL GOOGLE REVIEW CARD ──
export function GoogleReviewCard({ isHovered = false }: GoogleReviewCardProps) {
  const cardRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!cardRef.current) return;
    const targetScale = isHovered ? 1.04 : 1.0;
    cardRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 4);
  });

  return (
    <group ref={cardRef} position={[0, 0, 0]}>
      {/* ── CARD BODY (CREDIT CARD PROPORTIONS) ── */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[3.8, 2.4, 0.06]} />
        <meshStandardMaterial
          color="#0d0d11"
          roughness={0.28}
          metalness={0.4}
        />
      </mesh>

      {/* Polished Gold Bevel Border Frame */}
      <mesh position={[0, 0, 0.035]}>
        <boxGeometry args={[3.64, 2.24, 0.01]} />
        <meshStandardMaterial
          color="#f59e0b"
          metalness={0.95}
          roughness={0.15}
          wireframe
        />
      </mesh>

      {/* ── TOP HEADER: GOOGLE REVIEW TITLE ── */}
      <Text
        position={[-0.65, 0.75, 0.04]}
        fontSize={0.17}
        color="#fef08a"
        anchorX="left"
        anchorY="middle"
        letterSpacing={0.04}
        fontWeight={900}
      >
        GOOGLE REVIEW CARD
      </Text>

      <Text
        position={[-0.65, 0.52, 0.04]}
        fontSize={0.1}
        color="#d1d5db"
        anchorX="left"
        anchorY="middle"
      >
        5 Yıldızlı Değerlendirme İçin Dokundurun
      </Text>

      {/* 5-STAR GOLD BADGE */}
      <group position={[0, 0.12, 0.04]}>
        {[-0.8, -0.4, 0, 0.4, 0.8].map((xOffset, idx) => (
          <mesh key={idx} position={[xOffset, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.13, 0.13, 0.02, 5]} />
            <meshStandardMaterial
              color="#fbbf24"
              metalness={0.95}
              roughness={0.1}
              emissive="#f59e0b"
              emissiveIntensity={0.4}
            />
          </mesh>
        ))}
      </group>

      {/* ── BOTTOM ROW: NFC CHIP & MINI QR ── */}
      <group position={[-1.1, -0.65, 0.04]}>
        <mesh>
          <torusGeometry args={[0.26, 0.02, 16, 32]} />
          <meshStandardMaterial
            color="#fbbf24"
            metalness={0.95}
            roughness={0.12}
            emissive="#b45309"
            emissiveIntensity={0.3}
          />
        </mesh>
        <Text
          position={[0, 0, 0.01]}
          fontSize={0.11}
          color="#fef08a"
          anchorX="center"
          anchorY="middle"
          fontWeight={900}
        >
          NFC
        </Text>
      </group>

      <Text
        position={[-0.7, -0.65, 0.04]}
        fontSize={0.11}
        color="#e5e7eb"
        anchorX="left"
        anchorY="middle"
        fontWeight={700}
      >
        ANINDA YORUM SAYFASI
      </Text>

      {/* Mini Gold QR Box */}
      <group position={[1.35, -0.55, 0.04]}>
        <mesh>
          <boxGeometry args={[0.65, 0.65, 0.02]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0.015]}>
          <boxGeometry args={[0.55, 0.55, 0.01]} />
          <meshStandardMaterial color="#000000" roughness={0.6} />
        </mesh>
        <Text
          position={[0, 0, 0.025]}
          fontSize={0.09}
          color="#fbbf24"
          anchorX="center"
          anchorY="middle"
          fontWeight={900}
        >
          QR
        </Text>
      </group>
    </group>
  );
}

export interface TablePuckProps {
  isHovered?: boolean;
  patternVariant?: 1 | 2 | 3;
  venueName?: string;
  tableNumber?: string;
}

// ── 3. CUSTOMIZABLE ACRYLIC TABLE STICKER / PUCK (3 PATTERNS) ──
export function TablePuck({
  isHovered = false,
  patternVariant = 1,
  venueName = 'Baltazar Bistro',
  tableNumber = 'MASA #12',
}: TablePuckProps) {
  const puckRef = useRef<THREE.Group>(null);
  const glowRingRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (glowRingRef.current) {
      const t = state.clock.getElapsedTime();
      glowRingRef.current.rotation.z = t * 0.4;
    }
  });

  return (
    <group ref={puckRef} position={[0, -0.1, 0]}>
      {/* ── BASE DISK HOUSING (2mm ACRYILIC DISC) ── */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[1.75, 1.75, 0.35, 64]} />
        <meshStandardMaterial
          color="#101014"
          roughness={0.22}
          metalness={0.4}
        />
      </mesh>

      {/* Outer Metallic Gold Inlay Bezel */}
      <mesh position={[0, 0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.75, 0.05, 16, 64]} />
        <meshStandardMaterial
          color="#f59e0b"
          metalness={0.96}
          roughness={0.12}
          emissive="#d97706"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* High-Gloss Optical Resin Cap */}
      <mesh position={[0, 0.18, 0]} castShadow>
        <cylinderGeometry args={[1.56, 1.56, 0.08, 64]} />
        <meshPhysicalMaterial
          color="#141418"
          roughness={0.06}
          metalness={0.25}
          clearcoat={1}
          clearcoatRoughness={0.04}
        />
      </mesh>

      {/* ──────────────────────────────────────────────────────────
          PATTERN 1: MINIMALIST GOLD RIM
          ────────────────────────────────────────────────────────── */}
      {patternVariant === 1 && (
        <group position={[0, 0.23, 0]}>
          {/* Inner Sleek Gold Ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.35, 0.022, 16, 64]} />
            <meshStandardMaterial
              color="#fbbf24"
              metalness={0.95}
              roughness={0.1}
              emissive="#f59e0b"
              emissiveIntensity={0.6}
            />
          </mesh>

          {/* Secondary Delicate Hairline Ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.18, 0.01, 16, 64]} />
            <meshStandardMaterial
              color="#fde047"
              metalness={0.9}
              roughness={0.15}
              emissive="#d97706"
              emissiveIntensity={0.4}
            />
          </mesh>

          {/* Center NFC Golden Coil Emblem */}
          <group position={[0, 0.01, 0]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.38, 0.03, 16, 32]} />
              <meshStandardMaterial
                color="#fbbf24"
                metalness={0.95}
                roughness={0.1}
                emissive="#d97706"
                emissiveIntensity={0.5}
              />
            </mesh>
            <Text
              position={[0, 0, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={0.16}
              color="#fbbf24"
              anchorX="center"
              anchorY="middle"
              fontWeight={900}
            >
              NFC
            </Text>
          </group>

          {/* Minimalist Curved / Straight Labels */}
          <Text
            position={[0, 0.01, 0.72]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.11}
            color="#fef08a"
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.15}
            fontWeight={800}
          >
            TEMASSIZ MENÜ
          </Text>

          <Text
            position={[0, 0.01, -0.72]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.095}
            color="#94a3b8"
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.12}
            fontWeight={600}
          >
            DOKUNDURUN
          </Text>
        </group>
      )}

      {/* ──────────────────────────────────────────────────────────
          PATTERN 2: GEOMETRIC LASER BORDER (ART-DECO / HEXAGON)
          ────────────────────────────────────────────────────────── */}
      {patternVariant === 2 && (
        <group position={[0, 0.23, 0]}>
          {/* Laser-Etched Hexagonal Border Ring */}
          <mesh ref={glowRingRef} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.32, 0.02, 16, 6]} />
            <meshStandardMaterial
              color="#fbbf24"
              metalness={0.95}
              roughness={0.1}
              emissive="#f59e0b"
              emissiveIntensity={0.7}
            />
          </mesh>

          {/* Concentric Geometric Circle */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.05, 0.012, 16, 48]} />
            <meshStandardMaterial
              color="#fde047"
              metalness={0.9}
              roughness={0.2}
              emissive="#d97706"
              emissiveIntensity={0.4}
            />
          </mesh>

          {/* Geometric Corner Accent Diamonds */}
          {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, i) => (
            <mesh
              key={i}
              position={[Math.cos(angle) * 1.32, 0.01, Math.sin(angle) * 1.32]}
              rotation={[Math.PI / 2, 0, angle]}
            >
              <cylinderGeometry args={[0.045, 0.045, 0.01, 4]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.95} />
            </mesh>
          ))}

          {/* Central NFC Emblem */}
          <group position={[0, 0.01, 0]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.34, 0.025, 16, 32]} />
              <meshStandardMaterial
                color="#fbbf24"
                metalness={0.95}
                roughness={0.1}
                emissive="#d97706"
                emissiveIntensity={0.4}
              />
            </mesh>
            <Text
              position={[0, 0, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={0.15}
              color="#fbbf24"
              anchorX="center"
              anchorY="middle"
              fontWeight={900}
            >
              NFC
            </Text>
          </group>

          <Text
            position={[0, 0.01, 0.7]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.105}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.12}
            fontWeight={800}
          >
            SMART CONTACTLESS
          </Text>
        </group>
      )}

      {/* ──────────────────────────────────────────────────────────
          PATTERN 3: CUSTOM VENUE LOGO & TABLE NUMBER BADGE
          ────────────────────────────────────────────────────────── */}
      {patternVariant === 3 && (
        <group position={[0, 0.23, 0]}>
          {/* Outer Gold Ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.36, 0.02, 16, 64]} />
            <meshStandardMaterial
              color="#f59e0b"
              metalness={0.95}
              roughness={0.1}
              emissive="#d97706"
              emissiveIntensity={0.4}
            />
          </mesh>

          {/* Venue Name / Logo Text (Top) */}
          <Text
            position={[0, 0.01, -0.72]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.13}
            color="#fbbf24"
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.06}
            fontWeight={900}
          >
            {venueName.toUpperCase()}
          </Text>

          {/* Central Contactless Waves Emblem */}
          <group position={[0, 0.01, -0.05]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.3, 0.022, 16, 32]} />
              <meshStandardMaterial
                color="#fbbf24"
                metalness={0.95}
                roughness={0.1}
                emissive="#d97706"
                emissiveIntensity={0.5}
              />
            </mesh>
            <Text
              position={[0, 0, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={0.13}
              color="#fef08a"
              anchorX="center"
              anchorY="middle"
              fontWeight={900}
            >
              NFC
            </Text>
          </group>

          {/* Prominent Table Number Pill Badge (Bottom) */}
          <group position={[0, 0.01, 0.68]}>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[1.4, 0.01, 0.38]} />
              <meshStandardMaterial
                color="#1e1e24"
                roughness={0.2}
                metalness={0.8}
              />
            </mesh>
            <mesh position={[0, 0.005, 0]}>
              <boxGeometry args={[1.36, 0.01, 0.34]} />
              <meshStandardMaterial
                color="#f59e0b"
                metalness={0.95}
                roughness={0.1}
                wireframe
              />
            </mesh>
            <Text
              position={[0, 0.01, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={0.14}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
              letterSpacing={0.1}
              fontWeight={900}
            >
              {tableNumber.toUpperCase()}
            </Text>
          </group>
        </group>
      )}
    </group>
  );
}
