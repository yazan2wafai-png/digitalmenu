'use client';

import { motion } from 'framer-motion';
import { Layers, Cpu, Cloud, Zap, Sparkles } from 'lucide-react';

export function VisionSection() {
  const PILLARS = [
    {
      Icon: Layers,
      num: '01',
      color: { from: '#8A6835', to: '#C9A86C' },
      tag: 'FİZİKSEL ZANAAT',
      title: 'Kusursuz Pleksi & Dokunsal Estetik',
      desc: 'Masanızda sıradan bir kağıt veya basit plastik duramaz. 3–5mm dökme akrilik, elmas polisajlı kenarlar ve kabartmalı UV baskı ile mekanınızın lüks kimliğini tamamlıyoruz.',
    },
    {
      Icon: Cpu,
      num: '02',
      color: { from: '#7A6030', to: '#B8925A' },
      tag: 'GÖRÜNMEZ ÇİP MİMARİSİ',
      title: 'Pil Yok. Uygulama Yok. 0.2 Saniye.',
      desc: 'NXP NTAG213/215 yüksek çekimli bobinlerimiz telefon kılıfı arkasından dahi temas anında aktifleşir. Müşterinizi uygulama indirme zahmetinden kurtarır.',
    },
    {
      Icon: Cloud,
      num: '03',
      color: { from: '#5A6A4A', to: '#7A9A5A' },
      tag: 'AKILLI BULUT SAAS',
      title: 'Canlı Veri & Masadan Anında Sipariş',
      desc: 'Tek tıkla fiyat güncelleyin, 3 dilde masadan sipariş alın ve Google puanınızı organik olarak zirveye taşıyın. Bulut motorumuz her an canlı.',
    },
  ];

  const gold = '#C9A86C';

  return (
    <section className="py-28 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-5">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
            style={{
              background: 'rgba(201,168,108,0.08)',
              border: '1px solid rgba(201,168,108,0.25)',
              color: gold,
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Vizyon & Felsefemiz
          </div>
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight"
            style={{ color: '#F0E6D3' }}
          >
            Fiziksel Dünyanın Ağırlığı,{' '}
            <span className="gold-text">Dijital Dünyanın Hızıyla Buluştu.</span>
          </h2>
          <p className="text-base leading-relaxed" style={{ color: 'rgba(180,152,104,0.75)' }}>
            İki dünyayı kusursuz bir hibrit ekosistemde birleştirerek işletmelerin müşteri etkileşimini geleceğe taşıyoruz.
          </p>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PILLARS.map(({ Icon, num, color, tag, title, desc }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.55, delay: i * 0.12 }}
              className="group rounded-3xl p-8 flex flex-col gap-5 transition-all duration-300"
              style={{
                background: 'rgba(18,14,8,0.82)',
                border: '1px solid rgba(201,168,108,0.12)',
                backdropFilter: 'blur(24px)',
              }}
              whileHover={{
                borderColor: 'rgba(201,168,108,0.35)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
              }}
            >
              <div className="flex items-start justify-between">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${color.from}, ${color.to})`,
                    boxShadow: `0 8px 24px ${color.to}40`,
                  }}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <span className="font-mono font-black text-3xl" style={{ color: 'rgba(201,168,108,0.14)' }}>
                  {num}
                </span>
              </div>

              <div>
                <span className="text-xs font-bold tracking-widest uppercase block mb-2" style={{ color: 'rgba(201,168,108,0.55)' }}>
                  {tag}
                </span>
                <h3 className="text-xl font-black leading-tight" style={{ color: '#F0E6D3' }}>
                  {title}
                </h3>
              </div>

              <p className="text-sm leading-relaxed flex-1" style={{ color: 'rgba(180,152,104,0.72)' }}>
                {desc}
              </p>

              <div
                className="flex items-center gap-1.5 text-xs font-bold pt-3"
                style={{ borderTop: '1px solid rgba(201,168,108,0.08)', color: 'rgba(201,168,108,0.6)' }}
              >
                <Zap className="w-3.5 h-3.5" style={{ color: gold }} />
                Sıfır Sürtünmeli Temassız Deneyim
              </div>
            </motion.div>
          ))}
        </div>

        {/* Metric summary strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 grid grid-cols-2 lg:grid-cols-4 rounded-3xl overflow-hidden"
          style={{ background: 'rgba(20,15,7,0.92)', border: '1px solid rgba(201,168,108,0.18)' }}
        >
          {[
            { val: '0.2 sn', label: 'NFC Okuma Hızı' },
            { val: '+%340', label: 'Google Yorum Artışı' },
            { val: '3 Dil', label: 'TR / EN / AR Otomatik' },
            { val: '100K+', label: 'Ömür Boyu Dokunuş' },
          ].map(({ val, label }, i) => (
            <div
              key={i}
              className="p-8 text-center"
              style={{ borderRight: i < 3 ? '1px solid rgba(201,168,108,0.1)' : 'none' }}
            >
              <span className="block text-3xl font-black tracking-tight mb-1 gold-text">{val}</span>
              <span className="block text-xs font-semibold" style={{ color: 'rgba(180,152,104,0.65)' }}>
                {label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
