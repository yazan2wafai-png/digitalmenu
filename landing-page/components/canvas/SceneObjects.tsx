'use client';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

// ── 1. WALNUT WOOD & ACRYLIC TABLE STAND ──
export function TableStand({ isHovered }: { isHovered?: boolean }) {
  const standRef = useRef<THREE.Group>(null);
  const pulseRingRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (pulseRingRef.current) {
      const t = state.clock.getElapsedTime();
      pulseRingRef.current.scale.setScalar(1 + Math.sin(t * 3) * 0.08);
    }
  });

  return (
    <group ref={standRef} position={[0, -0.4, 0]}>
      {/* ── SOLID WALNUT WOOD BASE ── */}
      <mesh position={[0, -1.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 0.45, 1.4]} />
        <meshStandardMaterial
          color="#331c0e"
          roughness={0.45}
          metalness={0.08}
        />
      </mesh>

      {/* Wood Base Chamfer Trim */}
      <mesh position={[0, -1.4, 0]} receiveShadow>
        <boxGeometry args={[3.3, 0.1, 1.5]} />
        <meshStandardMaterial
          color="#221107"
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>

      {/* Brass / Gold Inlay Base Trim */}
      <mesh position={[0, -1.18, 0.705]}>
        <boxGeometry args={[2.8, 0.04, 0.02]} />
        <meshStandardMaterial
          color="#eab308"
          metalness={0.92}
          roughness={0.18}
          emissive="#b45309"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* ── ACRYLIC / GLASS MAIN SLAB ── */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 3.1, 0.12]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={0.88}
          opacity={1}
          transparent={true}
          roughness={0.06}
          ior={1.52}
          thickness={0.8}
          specularIntensity={1}
          specularColor="#ffffff"
        />
      </mesh>

      {/* Acrylic Subtle Golden Rim Glow */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[2.54, 3.14, 0.1]} />
        <meshStandardMaterial
          color="#f59e0b"
          transparent
          opacity={0.15}
          wireframe
        />
      </mesh>

      {/* ── METALLIC GOLD NFC LOGO BADGE & COIL ── */}
      <group position={[0, 1.25, 0.08]}>
        {/* Outer Ring */}
        <mesh>
          <torusGeometry args={[0.38, 0.025, 16, 48]} />
          <meshStandardMaterial
            color="#fbbf24"
            metalness={0.95}
            roughness={0.15}
            emissive="#d97706"
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* Pulsing NFC Signal Wave Ring */}
        <mesh ref={pulseRingRef}>
          <torusGeometry args={[0.48, 0.015, 16, 48]} />
          <meshStandardMaterial
            color="#fef08a"
            metalness={0.8}
            roughness={0.2}
            transparent
            opacity={0.6}
            emissive="#eab308"
            emissiveIntensity={0.5}
          />
        </mesh>

        {/* NFC Center Disc */}
        <mesh position={[0, 0, -0.01]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.32, 0.32, 0.02, 32]} />
          <meshStandardMaterial
            color="#1c1917"
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>

        <Text
          position={[0, 0, 0.02]}
          fontSize={0.15}
          color="#fbbf24"
          anchorX="center"
          anchorY="middle"
          fontWeight={900}
        >
          NFC
        </Text>
      </group>

      {/* ── HIGH-CONTRAST QR CODE PLATE ── */}
      <group position={[0, 0.15, 0.08]}>
        {/* Dark Ceramic QR Housing */}
        <mesh castShadow>
          <boxGeometry args={[1.3, 1.3, 0.04]} />
          <meshStandardMaterial
            color="#09090b"
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>

        {/* QR Plate Inner White Tile */}
        <mesh position={[0, 0, 0.025]}>
          <boxGeometry args={[1.15, 1.15, 0.02]} />
          <meshStandardMaterial
            color="#ffffff"
            roughness={0.2}
          />
        </mesh>

        {/* QR Core Simulation Grid */}
        <mesh position={[0, 0, 0.04]}>
          <boxGeometry args={[0.95, 0.95, 0.01]} />
          <meshStandardMaterial
            color="#0a0a0a"
            roughness={0.5}
          />
        </mesh>

        {/* QR Corner Alignment Squares */}
        <mesh position={[-0.32, 0.32, 0.05]}>
          <boxGeometry args={[0.26, 0.26, 0.01]} />
          <meshStandardMaterial color="#d97706" />
        </mesh>
        <mesh position={[0.32, 0.32, 0.05]}>
          <boxGeometry args={[0.26, 0.26, 0.01]} />
          <meshStandardMaterial color="#d97706" />
        </mesh>
        <mesh position={[-0.32, -0.32, 0.05]}>
          <boxGeometry args={[0.26, 0.26, 0.01]} />
          <meshStandardMaterial color="#d97706" />
        </mesh>
      </group>

      {/* ── ENGRAVED TEXT & CALL-TO-ACTION ── */}
      <Text
        position={[0, -0.65, 0.08]}
        fontSize={0.11}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.06}
        fontWeight={800}
      >
        DOKUN VEYA TARAT
      </Text>

      <Text
        position={[0, -0.82, 0.08]}
        fontSize={0.08}
        color="#fbbf24"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.12}
        fontWeight={700}
      >
        NFCMyPlace.com
      </Text>
    </group>
  );
}

// ── 2. MATTE BLACK & GOLD FOIL GOOGLE REVIEW CARD ──
export function GoogleReviewCard({ isHovered }: { isHovered?: boolean }) {
  const cardRef = useRef<THREE.Group>(null);

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

// ── 3. INDUSTRIAL WATERPROOF NFC TABLE PUCK / DISC ──
export function TablePuck({ isHovered }: { isHovered?: boolean }) {
  const puckRef = useRef<THREE.Group>(null);
  const glowRingRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (glowRingRef.current) {
      const t = state.clock.getElapsedTime();
      glowRingRef.current.rotation.z = t * 0.5;
    }
  });

  return (
    <group ref={puckRef} position={[0, -0.1, 0]}>
      {/* ── BASE DISK HOUSING ── */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[1.7, 1.7, 0.35, 64]} />
        <meshStandardMaterial
          color="#121318"
          roughness={0.25}
          metalness={0.5}
        />
      </mesh>

      {/* Chamfered Outer Gold Bezel */}
      <mesh position={[0, 0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.7, 0.06, 16, 64]} />
        <meshStandardMaterial
          color="#f59e0b"
          metalness={0.96}
          roughness={0.12}
          emissive="#d97706"
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* High-Gloss Resin Inner Cap */}
      <mesh position={[0, 0.18, 0]} castShadow>
        <cylinderGeometry args={[1.5, 1.5, 0.08, 64]} />
        <meshPhysicalMaterial
          color="#18181b"
          roughness={0.08}
          metalness={0.3}
          clearcoat={1}
          clearcoatRoughness={0.05}
        />
      </mesh>

      {/* Rotating Ambient Light Accent Ring */}
      <mesh ref={glowRingRef} position={[0, 0.23, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.25, 0.02, 16, 64]} />
        <meshStandardMaterial
          color="#fbbf24"
          metalness={0.9}
          roughness={0.1}
          emissive="#f59e0b"
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Central NFC Emblem */}
      <group position={[0, 0.24, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.38, 0.03, 16, 32]} />
          <meshStandardMaterial
            color="#fbbf24"
            metalness={0.95}
            roughness={0.1}
            emissive="#d97706"
            emissiveIntensity={0.4}
          />
        </mesh>

        <Text
          position={[0, 0.01, 0]}
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

      {/* Table Badge Number & Label */}
      <Text
        position={[0, 0.24, 0.72]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.14}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.08}
        fontWeight={800}
      >
        MASA #12
      </Text>

      <Text
        position={[0, 0.24, -0.72]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.09}
        color="#9ca3af"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.1}
        fontWeight={600}
      >
        3M SU GEÇİRMEZ REÇİNE
      </Text>
    </group>
  );
}
