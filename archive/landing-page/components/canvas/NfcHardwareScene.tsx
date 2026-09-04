'use client';
import { useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, ContactShadows, Environment, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { TableStand, GoogleReviewCard, TablePuck } from './SceneObjects';
import type { StandMaterialType } from './LStand3DModel';

export type ProductType = 'stand' | 'card' | 'sticker';

export interface SceneProps {
  product: ProductType;
  material?: StandMaterialType | string;
  white?: boolean;
  branding?: boolean;
  logoText?: string;
  businessName?: string;
  qrText?: string;
  showStars?: boolean;
  patternVariant?: 1 | 2 | 3;
  venueName?: string;
  tableNumber?: string;
  autoRotate?: boolean;
  template?: 'templateA' | 'templateB';
}

function InteractiveModelGroup({
  product,
  material = 'crystal',
  white = false,
  branding = true,
  logoText = 'Your Logo',
  businessName = 'Business Name (Optional)',
  qrText = 'nfcmyplace.com',
  showStars = true,
  patternVariant = 1,
  venueName = 'Baltazar Bistro',
  tableNumber = 'MASA #12',
  autoRotate = true,
  template = 'templateA',
}: SceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const { pointer } = useThree();

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Smooth subtle mouse parallax tilt
    const targetRotX = pointer.y * 0.22;
    const targetRotY = pointer.x * 0.4;

    groupRef.current.rotation.x = THREE.MathUtils.damp(
      groupRef.current.rotation.x,
      targetRotX,
      3.5,
      delta
    );

    // If autoRotate, slowly spin around Y while adding mouse influence
    if (autoRotate && !hovered) {
      groupRef.current.rotation.y += delta * 0.4;
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
    >
      <Float
        speed={hovered ? 3.5 : 2}
        rotationIntensity={hovered ? 0.35 : 0.2}
        floatIntensity={0.5}
        floatingRange={[-0.08, 0.08]}
      >
        {product === 'stand' && (
          <TableStand
            isHovered={hovered}
            material={material}
            white={white}
            branding={branding}
            logoText={logoText}
            businessName={businessName}
            qrText={qrText}
            showStars={showStars}
            template={template}
          />
        )}
        {product === 'card' && <GoogleReviewCard isHovered={hovered} />}
        {product === 'sticker' && (
          <TablePuck
            isHovered={hovered}
            patternVariant={patternVariant}
            venueName={venueName}
            tableNumber={tableNumber}
          />
        )}
      </Float>
    </group>
  );
}

export default function NfcHardwareScene({
  product,
  material = 'crystal',
  white = false,
  branding = true,
  logoText = 'Your Logo',
  businessName = 'Business Name (Optional)',
  qrText = 'nfcmyplace.com',
  showStars = true,
  patternVariant = 1,
  venueName = 'Baltazar Bistro',
  tableNumber = 'MASA #12',
  autoRotate = true,
  template = 'templateA',
}: SceneProps) {
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
      className="w-full h-full"
    >
      {/* ── STUDIO LIGHTING RIG ── */}
      <ambientLight intensity={0.85} />

      {/* Main Warm Key Light */}
      <directionalLight
        position={[5, 8, 6]}
        intensity={2.4}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0001}
        color="#fffbeb"
      />

      {/* Cyan/Blue Rim Fill Light */}
      <directionalLight
        position={[-6, 4, -4]}
        intensity={1.0}
        color="#38bdf8"
      />

      {/* Warm Golden Bottom Glow */}
      <pointLight
        position={[0, -2, 3]}
        intensity={1.8}
        color="#f59e0b"
        distance={8}
      />

      {/* High-Key Top Spot */}
      <spotLight
        position={[0, 7, 0]}
        intensity={1.4}
        angle={0.6}
        penumbra={0.8}
        color="#ffffff"
      />

      {/* Realistic HDRI Environment Reflections */}
      <Environment preset="city" />

      {/* ── 3D INTERACTIVE OBJECT ── */}
      <InteractiveModelGroup
        product={product}
        material={material}
        white={white}
        branding={branding}
        logoText={logoText}
        businessName={businessName}
        qrText={qrText}
        showStars={showStars}
        patternVariant={patternVariant}
        venueName={venueName}
        tableNumber={tableNumber}
        autoRotate={autoRotate}
        template={template}
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
