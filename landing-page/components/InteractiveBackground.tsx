'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export function InteractiveBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { clientX, clientY } = e;
      containerRef.current.style.setProperty('--mouse-x', `${clientX}px`);
      containerRef.current.style.setProperty('--mouse-y', `${clientY}px`);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={
        {
          '--mouse-x': '50vw',
          '--mouse-y': '30vh',
        } as React.CSSProperties
      }
    >
      {/* Deep Obsidian Matte Base */}
      <div className="absolute inset-0 bg-[#07090E]" />

      {/* Dynamic Cursor Ambient Spotlight */}
      <div
        className="absolute inset-0 transition-opacity duration-700 opacity-60 mix-blend-screen"
        style={{
          background: `radial-gradient(900px circle at var(--mouse-x) var(--mouse-y), rgba(217, 70, 239, 0.08), rgba(59, 130, 246, 0.05) 40%, transparent 80%)`,
        }}
      />

      {/* Floating Ambient Mesh Orbs */}
      <motion.div
        className="absolute -top-[15%] left-[10%] w-[600px] h-[600px] rounded-full blur-[140px] opacity-25"
        style={{
          background: 'radial-gradient(circle, rgba(168,85,247,0.35) 0%, rgba(59,130,246,0.15) 60%, transparent 80%)',
        }}
        animate={{
          x: [0, 40, -30, 0],
          y: [0, -30, 40, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute top-[40%] -right-[10%] w-[700px] h-[700px] rounded-full blur-[160px] opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(236,72,153,0.3) 0%, rgba(249,115,22,0.15) 50%, transparent 80%)',
        }}
        animate={{
          x: [0, -50, 20, 0],
          y: [0, 40, -30, 0],
          scale: [1, 0.9, 1.08, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute -bottom-[10%] left-[30%] w-[800px] h-[600px] rounded-full blur-[180px] opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(14,165,233,0.3) 0%, rgba(99,102,241,0.2) 60%, transparent 80%)',
        }}
        animate={{
          x: [0, 30, -40, 0],
          y: [0, -20, 30, 0],
          scale: [1, 1.05, 0.95, 1],
        }}
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Cybernetic Subtle Grid Texture (Originkit & Vengeance UI vibe) */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 90% 70% at 50% 40%, black 30%, transparent 90%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 50% 40%, black 30%, transparent 90%)',
        }}
      />

      {/* Pulsing Concentric NFC Wave Lines in Center */}
      <div className="absolute top-[22%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-20">
        {[200, 380, 560, 740].map((size, idx) => (
          <motion.div
            key={idx}
            className="absolute rounded-full border border-purple-500/20"
            style={{
              width: size,
              height: size,
              left: -size / 2,
              top: -size / 2,
            }}
            animate={{
              scale: [1, 1.04, 1],
              opacity: [0.15, 0.35, 0.15],
              borderColor: [
                'rgba(168, 85, 247, 0.15)',
                'rgba(59, 130, 246, 0.3)',
                'rgba(168, 85, 247, 0.15)',
              ],
            }}
            transition={{
              duration: 5 + idx * 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: idx * 0.8,
            }}
          />
        ))}
      </div>

      {/* Top Subtle Vignette */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/60 pointer-events-none" />
    </div>
  );
}
