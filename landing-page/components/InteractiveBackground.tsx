'use client';

import { motion } from 'framer-motion';

export function InteractiveBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#07090E]">
      {/* Deep Obsidian Matte Gradient Base */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#090B10] via-[#07080D] to-[#040508]" />

      {/* Subtle Luxury Ambient Glows (Static & Smoothly Breathing, not following mouse) */}
      <div
        className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[1000px] h-[500px] rounded-full opacity-20 blur-[150px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(168, 85, 247, 0.4) 0%, rgba(59, 130, 246, 0.2) 50%, transparent 80%)',
        }}
      />

      <div
        className="absolute top-[45%] -left-[10%] w-[600px] h-[600px] rounded-full opacity-15 blur-[160px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.35) 0%, transparent 70%)',
        }}
      />

      <div
        className="absolute top-[70%] -right-[10%] w-[700px] h-[700px] rounded-full opacity-15 blur-[180px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.3) 0%, transparent 70%)',
        }}
      />

      {/* Elegant Minimalist Cybernetic Grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 90% 80% at 50% 35%, black 40%, transparent 95%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 80% at 50% 35%, black 40%, transparent 95%)',
        }}
      />

      {/* Gentle Floating Light Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[
          { top: '15%', left: '20%', size: 3, delay: 0 },
          { top: '35%', left: '80%', size: 2, delay: 2 },
          { top: '60%', left: '30%', size: 2.5, delay: 4 },
          { top: '80%', left: '70%', size: 3, delay: 1 },
          { top: '25%', left: '55%', size: 2, delay: 3 },
        ].map((pt, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-purple-400/40 blur-[1px]"
            style={{
              top: pt.top,
              left: pt.left,
              width: pt.size,
              height: pt.size,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.7, 0.2],
            }}
            transition={{
              duration: 6 + i * 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: pt.delay,
            }}
          />
        ))}
      </div>

      {/* Top & Bottom Soft Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#040508]/80 pointer-events-none" />
    </div>
  );
}
