'use client';

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

/* ─── Luxury Warm-Toned Background ───
   Canvas particle field (micro-gold dust) + layered static mesh glows
   No mouse tracking. Pure cinematic depth. */
export function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf: number;
    const particles: {
      x: number; y: number; vx: number; vy: number;
      r: number; alpha: number; alphaDir: number;
    }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    /* Spawn tiny warm-gold dust particles */
    const COUNT = 90;
    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.18,
        vy: -Math.random() * 0.25 - 0.05,
        r: Math.random() * 1.2 + 0.2,
        alpha: Math.random() * 0.5 + 0.1,
        alphaDir: (Math.random() > 0.5 ? 1 : -1) * 0.004,
      });
    }

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += p.alphaDir;
        if (p.alpha <= 0.05 || p.alpha >= 0.6) p.alphaDir *= -1;
        if (p.y < -5) { p.y = canvas.height + 5; p.x = Math.random() * canvas.width; }
        if (p.x < -5) p.x = canvas.width + 5;
        if (p.x > canvas.width + 5) p.x = -5;

        ctx.beginPath();
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2.5);
        grad.addColorStop(0, `rgba(218,188,120,${p.alpha})`);
        grad.addColorStop(1, `rgba(180,140,70,0)`);
        ctx.arc(p.x, p.y, p.r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* ── WARM BASE GRADIENT ── */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 120% 80% at 50% -10%, #1E170C 0%, #0D0B08 55%, #060504 100%)',
      }} />

      {/* ── AMBIENT BLOB 1: warm amber top-left ── */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          top: '-15%', left: '-8%',
          width: 900, height: 700,
          background: 'radial-gradient(ellipse, rgba(160,108,40,0.22) 0%, rgba(100,65,15,0.08) 50%, transparent 75%)',
          filter: 'blur(90px)',
        }}
        animate={{ x: [0, 40, 0], y: [0, 25, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ── AMBIENT BLOB 2: golden center-right ── */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          top: '30%', right: '-12%',
          width: 700, height: 700,
          background: 'radial-gradient(ellipse, rgba(180,130,50,0.18) 0%, rgba(120,85,20,0.06) 50%, transparent 75%)',
          filter: 'blur(110px)',
        }}
        animate={{ x: [0, -35, 0], y: [0, -20, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
      />

      {/* ── AMBIENT BLOB 3: warm bronze bottom-left ── */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          bottom: '5%', left: '15%',
          width: 600, height: 500,
          background: 'radial-gradient(ellipse, rgba(140,95,30,0.14) 0%, rgba(80,55,10,0.05) 55%, transparent 80%)',
          filter: 'blur(100px)',
        }}
        animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 10 }}
      />

      {/* ── PARTICLE CANVAS (gold dust field) ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 opacity-80"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* ── ELEGANT DIAGONAL LINE GRID (very subtle) ── */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(201,168,108,0.8) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(201,168,108,0.8) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 30%, black 20%, transparent 90%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 30%, black 20%, transparent 90%)',
        }}
      />

      {/* ── HORIZONTAL SCAN LINE (ultra subtle animated) ── */}
      <motion.div
        className="absolute left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(to right, transparent, rgba(201,168,108,0.12), transparent)' }}
        animate={{ top: ['-2%', '102%'] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'linear', repeatDelay: 6 }}
      />

      {/* ── VIGNETTE EDGES ── */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(6,5,4,0.6) 100%)',
      }} />

      {/* ── BOTTOM FADE ── */}
      <div className="absolute bottom-0 left-0 right-0 h-64"
        style={{ background: 'linear-gradient(to top, #060504, transparent)' }}
      />
    </div>
  );
}
