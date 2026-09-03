'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { ArrowRight, CheckCircle2, Gift, ShieldCheck, Copy } from 'lucide-react';

export function EmailCaptureBespoke() {
  const [email, setEmail] = useState('');
  const [venue, setVenue] = useState('');
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const leads = JSON.parse(localStorage.getItem('nfc_leads') ?? '[]');
    leads.push({ email, venue, date: new Date().toISOString() });
    localStorage.setItem('nfc_leads', JSON.stringify(leads));
    setDone(true);
    confetti({ particleCount: 70, spread: 65, origin: { y: 0.8 }, colors: ['#C9A86C','#E2C99A','#8A6835','#F0D99B'] });
  };

  const gold = '#C9A86C';

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden p-10 sm:p-16 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(28,20,8,0.98) 0%, rgba(20,14,5,0.99) 100%)',
            border: '1px solid rgba(201,168,108,0.25)',
            boxShadow: '0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,168,108,0.08)',
          }}>
          {/* Decorative corner lines */}
          <div className="absolute top-0 left-0 w-20 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(201,168,108,0.5))' }} />
          <div className="absolute top-0 left-0 h-20 w-px" style={{ background: 'linear-gradient(to bottom, transparent, rgba(201,168,108,0.5))' }} />
          <div className="absolute bottom-0 right-0 w-20 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(201,168,108,0.5))' }} />
          <div className="absolute bottom-0 right-0 h-20 w-px" style={{ background: 'linear-gradient(to top, transparent, rgba(201,168,108,0.5))' }} />

          <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
              style={{ background: 'rgba(201,168,108,0.1)', border: '1px solid rgba(201,168,108,0.3)', color: gold }}>
              <Gift className="w-3.5 h-3.5" />
              VIP Erken Erişim Fırsatı
            </div>

            <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight" style={{ color: '#F0E6D3' }}>
              İlk Siparişinizde{' '}
              <span className="gold-text">%15 İndirim Kodunuzu</span>{' '}
              Anında Alın.
            </h2>

            <AnimatePresence mode="wait">
              {done ? (
                <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className="p-6 rounded-2xl space-y-4"
                  style={{ background: 'rgba(201,168,108,0.06)', border: '1px solid rgba(201,168,108,0.3)' }}>
                  <div className="flex items-center justify-center gap-2 font-bold text-base" style={{ color: gold }}>
                    <CheckCircle2 className="w-5 h-5" />
                    İndirim Kodunuz Hazır!
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <div className="px-6 py-3 rounded-xl font-mono text-xl font-black tracking-widest"
                      style={{ background: '#0D0B08', border: '1px solid rgba(201,168,108,0.5)', color: gold }}>
                      NFCVIP15
                    </div>
                    <button onClick={() => { navigator.clipboard.writeText('NFCVIP15'); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                      className="flex items-center gap-1.5 px-4 py-3 rounded-xl font-bold text-xs cursor-pointer transition-all hover:scale-105"
                      style={{ background: 'linear-gradient(135deg, #C9A86C, #8A6835)', color: '#0D0B08' }}>
                      <Copy className="w-4 h-4" />
                      {copied ? 'Kopyalandı!' : 'Kopyala'}
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleSubmit} className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input type="text" placeholder="İşletme Adı" value={venue} onChange={e => setVenue(e.target.value)}
                      className="sm:w-1/3 px-4 py-3.5 rounded-2xl text-sm outline-none transition-all"
                      style={{ background: 'rgba(13,11,6,0.8)', border: '1px solid rgba(201,168,108,0.2)', color: '#F0E6D3' }}
                      onFocus={e => (e.target.style.borderColor = 'rgba(201,168,108,0.5)')}
                      onBlur={e => (e.target.style.borderColor = 'rgba(201,168,108,0.2)')} />
                    <input type="email" required placeholder="E-Posta Adresiniz" value={email} onChange={e => setEmail(e.target.value)}
                      className="flex-1 px-4 py-3.5 rounded-2xl text-sm outline-none transition-all"
                      style={{ background: 'rgba(13,11,6,0.8)', border: '1px solid rgba(201,168,108,0.2)', color: '#F0E6D3' }}
                      onFocus={e => (e.target.style.borderColor = 'rgba(201,168,108,0.5)')}
                      onBlur={e => (e.target.style.borderColor = 'rgba(201,168,108,0.2)')} />
                    <button type="submit"
                      className="px-7 py-3.5 rounded-2xl font-black text-sm shrink-0 cursor-pointer transition-all hover:scale-105 flex items-center gap-2"
                      style={{ background: 'linear-gradient(135deg, #C9A86C, #8A5C2A)', color: '#0D0B08', boxShadow: '0 8px 28px rgba(180,130,40,0.4)' }}>
                      Kodu Al <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-center gap-4 text-xs font-semibold pt-1" style={{ color: 'rgba(180,152,104,0.5)' }}>
                    <span className="flex items-center gap-1" style={{ color: 'rgba(201,168,108,0.6)' }}><ShieldCheck className="w-3.5 h-3.5" />Spam Gönderilmez</span>
                    <span>•</span><span>Anında İndirim</span><span>•</span><span>İstediğiniz Zaman İptal</span>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
