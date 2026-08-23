'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function AmbientNfcWaves() {
  const emitters = [
    { top: '12%', left: '88%', size: 360, duration: 7, delay: 0 },
    { top: '48%', left: '8%', size: 420, duration: 8.5, delay: 1.5 },
    { top: '82%', left: '82%', size: 380, duration: 7.8, delay: 0.8 },
  ];

  const particles = [
    { x: '15%', y: '25%', size: 3, duration: 6, delay: 0 },
    { x: '82%', y: '18%', size: 4, duration: 7.5, delay: 1.2 },
    { x: '45%', y: '55%', size: 2.5, duration: 5.5, delay: 0.5 },
    { x: '92%', y: '68%', size: 3.5, duration: 8, delay: 2 },
    { x: '22%', y: '78%', size: 2.8, duration: 6.8, delay: 1 },
    { x: '68%', y: '88%', size: 3.2, duration: 7.2, delay: 1.8 },
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
      {/* ── AMBIENT NFC RADIO WAVE EMITTERS ── */}
      {emitters.map((emitter, idx) => (
        <div
          key={idx}
          className="absolute"
          style={{
            top: emitter.top,
            left: emitter.left,
            transform: 'translate3d(-50%, -50%, 0)',
            willChange: 'transform',
          }}
        >
          {/* Wave 1 */}
          <motion.div
            className="absolute rounded-full border border-amber-500/25"
            style={{
              width: emitter.size,
              height: emitter.size,
              transform: 'translate3d(-50%, -50%, 0)',
              willChange: 'transform, opacity',
            }}
            animate={{
              scale: [0.6, 1.4, 2.2],
              opacity: [0.35, 0.15, 0],
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
            className="absolute rounded-full border border-amber-400/20"
            style={{
              width: emitter.size,
              height: emitter.size,
              transform: 'translate3d(-50%, -50%, 0)',
              willChange: 'transform, opacity',
            }}
            animate={{
              scale: [0.6, 1.4, 2.2],
              opacity: [0.35, 0.15, 0],
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
            className="absolute rounded-full border border-yellow-300/15"
            style={{
              width: emitter.size,
              height: emitter.size,
              transform: 'translate3d(-50%, -50%, 0)',
              willChange: 'transform, opacity',
            }}
            animate={{
              scale: [0.6, 1.4, 2.2],
              opacity: [0.35, 0.15, 0],
            }}
            transition={{
              duration: emitter.duration,
              repeat: Infinity,
              ease: 'easeOut',
              delay: emitter.delay + (emitter.duration * 2) / 3,
            }}
          />

          {/* Emitter Core Glow */}
          <div
            className="w-2.5 h-2.5 rounded-full bg-amber-400/40 blur-xs shadow-lg shadow-amber-500/30 -translate-x-1/2 -translate-y-1/2"
            style={{ transform: 'translate3d(-50%, -50%, 0)' }}
          />
        </div>
      ))}

      {/* ── FLOATING AMBIENT PARTICLES ── */}
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 shadow-sm shadow-amber-400/50"
          style={{
            top: p.y,
            left: p.x,
            width: p.size,
            height: p.size,
            willChange: 'transform, opacity',
          }}
          animate={{
            y: [-12, 14, -12],
            x: [-6, 8, -6],
            opacity: [0.2, 0.65, 0.2],
            scale: [0.9, 1.3, 0.9],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
}

export default AmbientNfcWaves;
