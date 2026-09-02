'use client';

import { motion } from 'framer-motion';
import {
  Sparkles,
  Layers,
  Cpu,
  Cloud,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Globe2,
} from 'lucide-react';

export function VisionSection() {
  const PILLARS = [
    {
      icon: Layers,
      color: 'from-purple-500 to-indigo-500',
      tag: '01 / FİZİKSEL ZANAAT',
      title: 'Kusursuz Pleksi & Dokunsal Estetik',
      desc: 'Masanızda veya kasanızda sıradan bir kağıt ya da plastik duramaz. 3mm-5mm dökme akrilik pleksi, elmas polisajlı kenarlar ve yüksek çözünürlüklü kabartmalı UV baskı ile mekanınızın lüks kimliğini tamamlıyoruz.',
    },
    {
      icon: Cpu,
      color: 'from-pink-500 to-rose-500',
      tag: '02 / GÖRÜNMEZ ÇİP MİMARİSİ',
      title: 'Pil Yok. Uygulama Yok. 0.2 Saniye.',
      desc: 'NXP NTAG213 ve NTAG215 yüksek çekimli bobinlerimiz, telefon kılıfı arkasından dahi temas anında aktifleşir. Müşterinizi uygulama indirme veya yavaş QR tarama çilesinden kurtarır.',
    },
    {
      icon: Cloud,
      color: 'from-blue-500 to-cyan-500',
      tag: '03 / AKILLI BULUT SAAS',
      title: 'Canlı Veri & Masadan Anında Sipariş',
      desc: 'Fiziksel donanım yalnızca bir kapıdır; arkasında çalışan bulut motorumuzla tek tıkla fiyat güncelleyebilir, 3 dilde masadan sipariş alabilir ve Google puanınızı organik olarak zirveye taşıyabilirsiniz.',
    },
  ];

  return (
    <section className="relative py-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Section Headline */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/10 border border-purple-500/25 text-purple-300">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            Vizyon & Felsefemiz
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Fiziksel Dünyanın Ağırlığı,{' '}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Dijital Dünyanın Hızıyla Buluştu.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-white/60 leading-relaxed">
            Biz yalnızca yazılım ya da kart üretmiyoruz. İki dünyayı kusursuz bir hibrit ekosistemde birleştirerek restoran ve işletmelerin müşteri etkileşimini geleceğe taşıyoruz.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="relative rounded-3xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 hover:border-white/20 p-8 backdrop-blur-xl flex flex-col justify-between group shadow-xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${pillar.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-[11px] font-mono font-bold tracking-wider text-white/40">
                      {pillar.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 tracking-tight group-hover:text-purple-200 transition-colors">
                    {pillar.title}
                  </h3>

                  <p className="text-sm text-white/60 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>

                <div className="pt-6 border-t border-white/10 mt-8 flex items-center justify-between text-xs font-semibold text-purple-300">
                  <span>Sıfır Sürtünmeli Deneyim</span>
                  <Zap className="w-4 h-4 text-purple-400" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Real Venue Metrics Strip */}
        <div className="mt-16 rounded-3xl bg-gradient-to-r from-purple-950/40 via-neutral-900/60 to-blue-950/40 border border-purple-500/20 p-8 backdrop-blur-xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div>
              <span className="text-3xl sm:text-4xl font-black text-white block mb-1">0.2 sn</span>
              <span className="text-xs text-white/50">Ortalama NFC Okuma Süresi</span>
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-black text-emerald-400 block mb-1">+%340</span>
              <span className="text-xs text-white/50">Google Yorum Artış Oranı</span>
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-black text-purple-400 block mb-1">3 Dil</span>
              <span className="text-xs text-white/50">TR / EN / AR Otomatik Çeviri</span>
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-black text-blue-400 block mb-1">100.000+</span>
              <span className="text-xs text-white/50">Dokunuş Ömrü Garantisi</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
