'use client';
import { useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, ContactShadows, Environment, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { LStand3DModel, type StandMaterialType } from './canvas/LStand3DModel';

export interface Stand3DProps {
  white?: boolean;
  logoText?: string;
  businessName?: string;
  qrText?: string;
  showStars?: boolean;
  branding?: boolean;
  material?: StandMaterialType | string;
  autoRotate?: boolean;
}

function StandSceneObject({
  white = false,
  logoText = 'Your Logo',
  businessName = 'Business Name (Optional)',
  qrText = 'nfcmyplace.com',
  showStars = true,
  branding = true,
  material = 'crystal',
  autoRotate = true,
}: Stand3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const { pointer } = useThree();

  useFrame((state, delta) => {
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

    // Auto rotate unless hovered or dragging
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
    >
      <Float
        speed={hovered ? 3.5 : 2}
        rotationIntensity={hovered ? 0.35 : 0.2}
        floatIntensity={0.5}
        floatingRange={[-0.08, 0.08]}
      >
        <LStand3DModel
          white={white}
          logoText={logoText}
          businessName={businessName}
          qrText={qrText}
          showStars={showStars}
          branding={branding}
          material={material}
          isHovered={hovered}
        />
      </Float>
    </group>
  );
}

export default function Stand3D({
  white = false,
  logoText = 'Your Logo',
  businessName = 'Business Name (Optional)',
  qrText = 'nfcmyplace.com',
  showStars = true,
  branding = true,
  material = 'crystal',
  autoRotate = true,
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

      {/* ── 3D L-STAND MODEL ── */}
      <StandSceneObject
        white={white}
        logoText={logoText}
        businessName={businessName}
        qrText={qrText}
        showStars={showStars}
        branding={branding}
        material={material}
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
