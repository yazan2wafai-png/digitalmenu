'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export function AmbientNfcWaves() {
  const { scrollYProgress } = useScroll();

  // Scroll-driven parallax transforms
  const yMesh = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const yBeamGold = useTransform(scrollYProgress, [0, 1], [-80, 260]);
  const yBeamCyan = useTransform(scrollYProgress, [0, 1], [120, -220]);
  const xBeamGold = useTransform(scrollYProgress, [0, 0.5, 1], ['-15%', '10%', '-5%']);
  const xBeamCyan = useTransform(scrollYProgress, [0, 0.5, 1], ['95%', '75%', '90%']);
  
  const scaleWaves = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1.3, 1.05]);
  const yPulse1 = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const yPulse2 = useTransform(scrollYProgress, [0, 1], [0, -320]);
  const yPulse3 = useTransform(scrollYProgress, [0, 1], [0, -240]);

  const rotEmitter1 = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const rotEmitter2 = useTransform(scrollYProgress, [0, 1], [0, -75]);

  const emitters = [
    {
      id: 'emitter-hero',
      top: '14%',
      left: '86%',
      size: 380,
      duration: 6.5,
      delay: 0,
      yMotion: yPulse1,
      color: 'amber',
    },
    {
      id: 'emitter-mid',
      top: '46%',
      left: '10%',
      size: 440,
      duration: 8,
      delay: 1.2,
      yMotion: yPulse2,
      color: 'cyan',
    },
    {
      id: 'emitter-pricing',
      top: '80%',
      left: '84%',
      size: 400,
      duration: 7.2,
      delay: 0.6,
      yMotion: yPulse3,
      color: 'gold',
    },
  ];

  const particles = [
    { x: '12%', y: '22%', size: 3.5, duration: 6, delay: 0, color: '#fbbf24', factor: -90 },
    { x: '84%', y: '16%', size: 4, duration: 7.5, delay: 1.2, color: '#38bdf8', factor: -140 },
    { x: '42%', y: '50%', size: 3, duration: 5.5, delay: 0.5, color: '#f59e0b', factor: -180 },
    { x: '90%', y: '64%', size: 4.5, duration: 8, delay: 2, color: '#06b6d4', factor: -220 },
    { x: '20%', y: '74%', size: 3.2, duration: 6.8, delay: 1, color: '#fbbf24', factor: -260 },
    { x: '65%', y: '86%', size: 3.8, duration: 7.2, delay: 1.8, color: '#eab308', factor: -190 },
  ];

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none"
      style={{
        transform: 'translate3d(0, 0, 0)',
        willChange: 'transform',
      }}
      aria-hidden="true"
    >
      {/* ── 1. SCROLL-DRIVEN MICRO-DOT MESH BACKGROUND ── */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          y: yMesh,
          transform: 'translate3d(0, 0, 0)',
          willChange: 'transform',
        }}
      >
        <svg className="w-full h-[140%] -top-[20%]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="ambient-grid-mesh"
              width="36"
              height="36"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1" fill="#f59e0b" fillOpacity="0.45" />
              <circle cx="20" cy="20" r="0.75" fill="#38bdf8" fillOpacity="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ambient-grid-mesh)" />
        </svg>
      </motion.div>

      {/* ── 2. SCROLL-DRIVEN SHIFTING GRADIENT LIGHT BEAMS ── */}
      {/* Golden Soft Light Beam (Top-Left to Bottom-Right Flow) */}
      <motion.div
        className="absolute w-[680px] h-[680px] rounded-full blur-3xl opacity-25"
        style={{
          top: '15%',
          left: xBeamGold,
          y: yBeamGold,
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, rgba(217, 119, 6, 0.08) 50%, transparent 75%)',
          transform: 'translate3d(0, 0, 0)',
          willChange: 'transform',
        }}
      />

      {/* Cyan Glowing Light Beam (Mid-Right to Mid-Left Flow) */}
      <motion.div
        className="absolute w-[620px] h-[620px] rounded-full blur-3xl opacity-20"
        style={{
          top: '42%',
          left: xBeamCyan,
          y: yBeamCyan,
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.25) 0%, rgba(6, 182, 212, 0.08) 50%, transparent 75%)',
          transform: 'translate3d(0, 0, 0)',
          willChange: 'transform',
        }}
      />

      {/* Deep Amber Light Beam for Pricing Section */}
      <motion.div
        className="absolute w-[650px] h-[650px] rounded-full blur-3xl opacity-20"
        style={{
          bottom: '10%',
          right: '5%',
          y: yPulse3,
          background: 'radial-gradient(circle, rgba(251, 191, 36, 0.2) 0%, rgba(180, 83, 9, 0.06) 55%, transparent 75%)',
          transform: 'translate3d(0, 0, 0)',
          willChange: 'transform',
        }}
      />

      {/* ── 3. SCROLL-DRIVEN DUAL-FREQUENCY NFC RADIO PULSES ── */}
      {emitters.map((emitter, idx) => {
        const isCyan = emitter.color === 'cyan';
        const primaryBorder = isCyan ? 'border-cyan-400/30' : 'border-amber-500/30';
        const secondaryBorder = isCyan ? 'border-sky-300/20' : 'border-amber-400/20';
        const coreGlow = isCyan
          ? 'bg-cyan-400/60 shadow-cyan-400/50'
          : 'bg-amber-400/60 shadow-amber-500/50';

        return (
          <motion.div
            key={emitter.id}
            className="absolute"
            style={{
              top: emitter.top,
              left: emitter.left,
              y: emitter.yMotion,
              scale: scaleWaves,
              rotate: idx === 0 ? rotEmitter1 : idx === 1 ? rotEmitter2 : 0,
              transform: 'translate3d(-50%, -50%, 0)',
              willChange: 'transform',
            }}
          >
            {/* Wave 1 */}
            <motion.div
              className={`absolute rounded-full border ${primaryBorder}`}
              style={{
                width: emitter.size,
                height: emitter.size,
                transform: 'translate3d(-50%, -50%, 0)',
                willChange: 'transform, opacity',
              }}
              animate={{
                scale: [0.6, 1.4, 2.3],
                opacity: [0.35, 0.16, 0],
              }}
              transition={{
                duration: emitter.duration,
                repeat: Infinity,
                ease: 'easeOut',
                delay: emitter.delay,
              }}
            />

            {/* Wave 2 */}
            <motion.div
              className={`absolute rounded-full border ${secondaryBorder}`}
              style={{
                width: emitter.size,
                height: emitter.size,
                transform: 'translate3d(-50%, -50%, 0)',
                willChange: 'transform, opacity',
              }}
              animate={{
                scale: [0.6, 1.4, 2.3],
                opacity: [0.35, 0.16, 0],
              }}
              transition={{
                duration: emitter.duration,
                repeat: Infinity,
                ease: 'easeOut',
                delay: emitter.delay + emitter.duration / 3,
              }}
            />

            {/* Wave 3 */}
            <motion.div
              className={`absolute rounded-full border ${primaryBorder}`}
              style={{
                width: emitter.size,
                height: emitter.size,
                transform: 'translate3d(-50%, -50%, 0)',
                willChange: 'transform, opacity',
              }}
              animate={{
                scale: [0.6, 1.4, 2.3],
                opacity: [0.35, 0.16, 0],
              }}
              transition={{
                duration: emitter.duration,
                repeat: Infinity,
                ease: 'easeOut',
                delay: emitter.delay + (emitter.duration * 2) / 3,
              }}
            />

            {/* Central NFC Pulse Core */}
            <div
              className={`w-3 h-3 rounded-full ${coreGlow} blur-xs shadow-lg -translate-x-1/2 -translate-y-1/2`}
              style={{ transform: 'translate3d(-50%, -50%, 0)' }}
            />
          </motion.div>
        );
      })}

      {/* ── 4. PARALLAX DRIFTING PARTICLES ── */}
      {particles.map((p, i) => {
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              top: p.y,
              left: p.x,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              boxShadow: `0 0 10px ${p.color}`,
              transform: 'translate3d(0, 0, 0)',
              willChange: 'transform, opacity',
            }}
            animate={{
              y: [-14, 16, -14],
              x: [-8, 10, -8],
              opacity: [0.2, 0.65, 0.2],
              scale: [0.85, 1.3, 0.85],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: p.delay,
            }}
          />
        );
      })}
    </div>
  );
}

export default AmbientNfcWaves;
