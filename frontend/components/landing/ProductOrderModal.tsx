'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  X,
  CheckCircle2,
  Upload,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  Zap,
  Building2,
  Link as LinkIcon,
  Phone,
  Mail,
  User,
  MapPin,
  Lock,
} from 'lucide-react';
import type { ProductItem, ProductColor } from '@/lib/products';
import { calculateProductPrice } from '@/lib/products';

interface ProductOrderModalProps {
  product: ProductItem | null;
  initialColor?: ProductColor;
  isOpen: boolean;
  onClose: () => void;
}

const COLOR_OPTIONS: { id: ProductColor; label: string; desc: string; previewClass: string }[] = [
  {
    id: 'black',
    label: 'Mat Siyah',
    desc: 'Lüks mat siyah pleksi, çizilmeye dayanıklı UV yüzey',
    previewClass: 'bg-[#181512] border-[#C9A86C]/40',
  },
  {
    id: 'white',
    label: 'Parlak Beyaz',
    desc: 'Kar beyazı pürüzsüz akrilik pleksi, yüksek kontrast',
    previewClass: 'bg-[#F2ECE1] border-[#C9A86C]/50 text-neutral-900',
  },
  {
    id: 'transparent',
    label: 'Kristal Şeffaf',
    desc: 'Elmas polisajlı 5mm cam berraklığında dökme akrilik',
    previewClass: 'bg-gradient-to-tr from-amber-200/20 to-white/30 border-[#C9A86C]/60',
  },
];

export function ProductOrderModal({
  product,
  initialColor = 'black',
  isOpen,
  onClose,
}: ProductOrderModalProps) {
  const [selectedColor, setSelectedColor] = useState<ProductColor>(initialColor);
  const [quantity, setQuantity] = useState(1);
  const [venueName, setVenueName] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('İstanbul');
  const [logoFileName, setLogoFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  useEffect(() => {
    if (product) {
      setSelectedColor(initialColor || (product.colors && product.colors[0]) || 'black');
      const minQty = product.bulkTiers && product.bulkTiers[0] ? product.bulkTiers[0].minQty : 1;
      setQuantity(minQty);
      setIsSuccess(false);
    }
  }, [product, initialColor]);

  if (!isOpen || !product) return null;

  const minAllowedQty = product.bulkTiers && product.bulkTiers[0] ? product.bulkTiers[0].minQty : 1;
  const pricing = calculateProductPrice(product, quantity);
  const currentImage =
    product.images[selectedColor] ||
    product.images.default ||
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';

  const handleQtyChange = (newQty: number) => {
    if (newQty >= minAllowedQty && newQty <= 500) {
      setQuantity(newQty);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const generatedOrderId = `NFC-${Math.floor(100000 + Math.random() * 900000)}`;

    const orderPayload = {
      orderId: generatedOrderId,
      productId: product.id,
      productName: product.name,
      color: selectedColor,
      quantity,
      unitPrice: pricing.unitPrice,
      totalPrice: pricing.totalPrice,
      currency: product.currency,
      venueName,
      targetUrl,
      notes,
      customer: {
        name: customerName,
        email,
        phone,
        address,
        city,
      },
      logoFile: logoFileName || null,
      createdAt: new Date().toISOString(),
    };

    try {
      const existingOrders = JSON.parse(localStorage.getItem('nfc_orders') || '[]');
      existingOrders.push(orderPayload);
      localStorage.setItem('nfc_orders', JSON.stringify(existingOrders));

      await new Promise((resolve) => setTimeout(resolve, 600));

      setOrderNumber(generatedOrderId);
      setIsSuccess(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#C9A86C', '#E2C99A', '#8A6835', '#F0D99B'],
      });
    } catch (err) {
      console.error('Order error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const gold = '#C9A86C';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          className="fixed inset-0 bg-black/85 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal Window Container */}
        <motion.div
          className="relative w-full max-w-4xl rounded-3xl overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.9)] z-10 my-auto text-[#F0E6D3] flex flex-col max-h-[92vh]"
          style={{
            background: 'linear-gradient(135deg, rgba(24,19,12,0.98) 0%, rgba(14,11,7,0.99) 100%)',
            border: '1px solid rgba(201,168,108,0.25)',
          }}
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Top Bar */}
          <div
            className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 backdrop-blur-md"
            style={{
              background: 'rgba(20,15,9,0.92)',
              borderBottom: '1px solid rgba(201,168,108,0.15)',
            }}
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full beacon" style={{ background: gold }} />
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: gold }}>
                Özelleştirme & Sipariş Konfigüratörü
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full transition-colors cursor-pointer"
              style={{ background: 'rgba(201,168,108,0.08)', color: 'rgba(212,188,150,0.8)' }}
              aria-label="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Scroll Content */}
          <div className="overflow-y-auto p-6 sm:p-8 space-y-8 flex-1 scrollbar-none">
            {isSuccess ? (
              /* Success Celebration State */
              <motion.div
                className="py-12 text-center space-y-6 max-w-md mx-auto"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto text-2xl"
                  style={{
                    background: 'rgba(201,168,108,0.15)',
                    border: '2px solid rgba(201,168,108,0.4)',
                    color: gold,
                  }}
                >
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-2xl font-black tracking-tight mb-2" style={{ color: '#F0E6D3' }}>
                    Siparişiniz Başarıyla Alındı!
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(180,152,104,0.75)' }}>
                    Sipariş Numaranız: <span className="font-bold" style={{ color: gold }}>{orderNumber}</span>. Tasarım ekibimiz logonuzu işleyip 24 saat içinde onayınız için sizinle iletişime geçecektir.
                  </p>
                </div>

                <div
                  className="p-4 rounded-2xl text-left space-y-2 text-xs"
                  style={{ background: 'rgba(13,10,6,0.8)', border: '1px solid rgba(201,168,108,0.15)' }}
                >
                  <div className="flex justify-between py-1 border-b border-[rgba(201,168,108,0.08)]">
                    <span style={{ color: 'rgba(180,152,104,0.6)' }}>Ürün:</span>
                    <span className="font-semibold">{product.name}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[rgba(201,168,108,0.08)]">
                    <span style={{ color: 'rgba(180,152,104,0.6)' }}>Varyant / Adet:</span>
                    <span>{selectedColor.toUpperCase()} — {quantity} Adet</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span style={{ color: 'rgba(180,152,104,0.6)' }}>Toplam Tutar:</span>
                    <span className="font-bold" style={{ color: gold }}>
                      {pricing.totalPrice.toLocaleString('tr-TR')} {product.currency}
                    </span>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="w-full py-3.5 rounded-2xl font-bold text-sm cursor-pointer transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #C9A86C, #8A6835)', color: '#0D0B08' }}
                >
                  Tamam & Kapat
                </button>
              </motion.div>
            ) : (
              /* Customizer & Order Form */
              <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Product Visual & Color Selector */}
                <div className="lg:col-span-5 space-y-6">
                  <div
                    className="relative w-full h-64 rounded-2xl overflow-hidden group"
                    style={{ background: '#0D0B08', border: '1px solid rgba(201,168,108,0.2)' }}
                  >
                    <Image
                      src={currentImage}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          'linear-gradient(to top, rgba(13,10,6,0.9) 0%, transparent 60%)',
                      }}
                    />
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="text-xs font-bold block" style={{ color: '#F0E6D3' }}>
                        {product.name}
                      </span>
                      <span className="text-[11px]" style={{ color: 'rgba(180,152,104,0.7)' }}>
                        {product.categoryLabel}
                      </span>
                    </div>
                  </div>

                  {/* Color Selector */}
                  {product.colors && product.colors.length > 0 && (
                    <div className="space-y-3">
                      <label className="block text-xs font-bold uppercase tracking-wider" style={{ color: gold }}>
                        Pleksi Renk & Doku Seçimi
                      </label>
                      <div className="grid grid-cols-1 gap-2.5">
                        {COLOR_OPTIONS.filter((c) => product.colors?.includes(c.id)).map((opt) => {
                          const isSelected = selectedColor === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => setSelectedColor(opt.id)}
                              className="w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer"
                              style={{
                                background: isSelected ? 'rgba(201,168,108,0.12)' : 'rgba(18,14,8,0.7)',
                                borderColor: isSelected ? 'rgba(201,168,108,0.5)' : 'rgba(201,168,108,0.12)',
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-6 h-6 rounded-full border shadow-sm ${opt.previewClass}`}
                                />
                                <div>
                                  <span className="text-xs font-bold block" style={{ color: '#F0E6D3' }}>
                                    {opt.label}
                                  </span>
                                  <span className="text-[10px]" style={{ color: 'rgba(180,152,104,0.6)' }}>
                                    {opt.desc}
                                  </span>
                                </div>
                              </div>
                              {isSelected && <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: gold }} />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Quantity selector */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold uppercase tracking-wider" style={{ color: gold }}>
                        Sipariş Adedi
                      </span>
                      {pricing.discountPercentage > 0 && (
                        <span
                          className="px-2 py-0.5 rounded-full font-bold text-[10px]"
                          style={{ background: 'rgba(201,168,108,0.15)', color: gold }}
                        >
                          %{pricing.discountPercentage} Toptan İndirimi
                        </span>
                      )}
                    </div>
                    <div
                      className="flex items-center justify-between p-2 rounded-xl"
                      style={{ background: 'rgba(13,10,6,0.8)', border: '1px solid rgba(201,168,108,0.15)' }}
                    >
                      <button
                        type="button"
                        onClick={() => handleQtyChange(quantity - 1)}
                        disabled={quantity <= minAllowedQty}
                        className="p-2 rounded-lg transition-colors cursor-pointer disabled:opacity-30"
                        style={{ background: 'rgba(201,168,108,0.08)', color: gold }}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-black text-base">{quantity} Adet</span>
                      <button
                        type="button"
                        onClick={() => handleQtyChange(quantity + 1)}
                        className="p-2 rounded-lg transition-colors cursor-pointer"
                        style={{ background: 'rgba(201,168,108,0.08)', color: gold }}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Pricing Breakdown Summary Box */}
                  <div
                    className="p-4 rounded-2xl space-y-2 text-xs"
                    style={{ background: 'rgba(13,10,6,0.8)', border: '1px solid rgba(201,168,108,0.15)' }}
                  >
                    <div className="flex justify-between" style={{ color: 'rgba(180,152,104,0.7)' }}>
                      <span>Birim Fiyat:</span>
                      <span className="font-semibold text-white">
                        {pricing.unitPrice.toLocaleString('tr-TR')} {product.currency}
                      </span>
                    </div>
                    {pricing.discountAmount > 0 && (
                      <div className="flex justify-between" style={{ color: gold }}>
                        <span>İndirim Tutarı:</span>
                        <span>-{pricing.discountAmount.toLocaleString('tr-TR')} {product.currency}</span>
                      </div>
                    )}
                    <div
                      className="flex justify-between items-baseline pt-2"
                      style={{ borderTop: '1px solid rgba(201,168,108,0.1)' }}
                    >
                      <span className="font-bold">Toplam Tutar:</span>
                      <span className="text-xl font-black gold-text">
                        {pricing.totalPrice.toLocaleString('tr-TR')} {product.currency}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Customization Fields + Customer Info */}
                <div className="lg:col-span-7 space-y-5">
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold flex items-center gap-2" style={{ color: gold }}>
                      <Building2 className="w-4 h-4" />
                      1. Mekan & Baskı Bilgileri
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold mb-1" style={{ color: 'rgba(180,152,104,0.8)' }}>
                          İşletme / Mekan Adı *
                        </label>
                        <input
                          type="text"
                          required
                          value={venueName}
                          onChange={(e) => setVenueName(e.target.value)}
                          placeholder="Örn: Baltazar Burger Karaköy"
                          className="w-full px-3.5 py-2.5 rounded-xl text-xs outline-none transition-all"
                          style={{
                            background: 'rgba(13,10,6,0.8)',
                            border: '1px solid rgba(201,168,108,0.2)',
                            color: '#F0E6D3',
                          }}
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold mb-1" style={{ color: 'rgba(180,152,104,0.8)' }}>
                          Google Haritalar / Menü Linki
                        </label>
                        <div className="relative">
                          <input
                            type="url"
                            value={targetUrl}
                            onChange={(e) => setTargetUrl(e.target.value)}
                            placeholder="https://g.page/r/... ya da nfcmyplace.com"
                            className="w-full pl-8 pr-3 py-2.5 rounded-xl text-xs outline-none transition-all"
                            style={{
                              background: 'rgba(13,10,6,0.8)',
                              border: '1px solid rgba(201,168,108,0.2)',
                              color: '#F0E6D3',
                            }}
                          />
                          <LinkIcon className="w-3.5 h-3.5 absolute left-2.5 top-3 text-[rgba(201,168,108,0.5)]" />
                        </div>
                      </div>
                    </div>

                    {/* Logo upload drop area */}
                    <div>
                      <label className="block text-[11px] font-semibold mb-1" style={{ color: 'rgba(180,152,104,0.8)' }}>
                        Logo Dosyası (Vektörel AI / PDF / SVG veya Yüksek Çözünürlüklü PNG)
                      </label>
                      <label
                        className="flex flex-col items-center justify-center p-4 rounded-xl border border-dashed cursor-pointer transition-all hover:bg-[rgba(201,168,108,0.04)]"
                        style={{ borderColor: 'rgba(201,168,108,0.3)', background: 'rgba(13,10,6,0.5)' }}
                      >
                        <Upload className="w-5 h-5 mb-1" style={{ color: gold }} />
                        <span className="text-xs font-semibold" style={{ color: '#F0E6D3' }}>
                          {logoFileName ? logoFileName : 'Logo dosyasını buraya sürükleyin veya seçin'}
                        </span>
                        <span className="text-[10px] mt-0.5" style={{ color: 'rgba(180,152,104,0.5)' }}>
                          Baskı ekibimiz logonuzu pleksiye uygun kabartmalı UV şablona uyarlayacaktır.
                        </span>
                        <input
                          type="file"
                          accept=".ai,.pdf,.svg,.png,.jpg,.jpeg"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold mb-1" style={{ color: 'rgba(180,152,104,0.8)' }}>
                        Özel Baskı Notu (Opsiyonel)
                      </label>
                      <input
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Örn: Masalara 1'den 20'ye kadar masa numarası basılsın."
                        className="w-full px-3.5 py-2 rounded-xl text-xs outline-none transition-all"
                        style={{
                          background: 'rgba(13,10,6,0.8)',
                          border: '1px solid rgba(201,168,108,0.2)',
                          color: '#F0E6D3',
                        }}
                      />
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="space-y-4 pt-3" style={{ borderTop: '1px solid rgba(201,168,108,0.1)' }}>
                    <h4 className="text-sm font-bold flex items-center gap-2" style={{ color: gold }}>
                      <User className="w-4 h-4" />
                      2. İletişim & Kargo Teslimat Bilgileri
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold mb-1" style={{ color: 'rgba(180,152,104,0.8)' }}>
                          Yetkili Adı Soyadı *
                        </label>
                        <input
                          type="text"
                          required
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="Ad Soyad"
                          className="w-full px-3.5 py-2.5 rounded-xl text-xs outline-none transition-all"
                          style={{
                            background: 'rgba(13,10,6,0.8)',
                            border: '1px solid rgba(201,168,108,0.2)',
                            color: '#F0E6D3',
                          }}
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold mb-1" style={{ color: 'rgba(180,152,104,0.8)' }}>
                          Telefon Numarası *
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="0532 123 45 67"
                          className="w-full px-3.5 py-2.5 rounded-xl text-xs outline-none transition-all"
                          style={{
                            background: 'rgba(13,10,6,0.8)',
                            border: '1px solid rgba(201,168,108,0.2)',
                            color: '#F0E6D3',
                          }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold mb-1" style={{ color: 'rgba(180,152,104,0.8)' }}>
                          E-Posta Adresi *
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="ornek@restoran.com"
                          className="w-full px-3.5 py-2.5 rounded-xl text-xs outline-none transition-all"
                          style={{
                            background: 'rgba(13,10,6,0.8)',
                            border: '1px solid rgba(201,168,108,0.2)',
                            color: '#F0E6D3',
                          }}
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold mb-1" style={{ color: 'rgba(180,152,104,0.8)' }}>
                          Şehir *
                        </label>
                        <input
                          type="text"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="İstanbul"
                          className="w-full px-3.5 py-2.5 rounded-xl text-xs outline-none transition-all"
                          style={{
                            background: 'rgba(13,10,6,0.8)',
                            border: '1px solid rgba(201,168,108,0.2)',
                            color: '#F0E6D3',
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold mb-1" style={{ color: 'rgba(180,152,104,0.8)' }}>
                        Kargo Teslimat Adresi *
                      </label>
                      <textarea
                        required
                        rows={2}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Mekan açık adresi, mahalle, cadde, kapı no..."
                        className="w-full px-3.5 py-2 rounded-xl text-xs outline-none transition-all resize-none"
                        style={{
                          background: 'rgba(13,10,6,0.8)',
                          border: '1px solid rgba(201,168,108,0.2)',
                          color: '#F0E6D3',
                        }}
                      />
                    </div>
                  </div>

                  {/* Trust badges */}
                  <div
                    className="flex flex-wrap items-center gap-4 text-[10px] font-semibold pt-2"
                    style={{ color: 'rgba(180,152,104,0.6)' }}
                  >
                    <div className="flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5" style={{ color: gold }} />
                      <span>48 Saatte Özel Üretim & Sigortalı Kargo</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" style={{ color: gold }} />
                      <span>10 Yıl Çip & UV Baskı Garantisi</span>
                    </div>
                  </div>

                  {/* Submit CTA */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                    style={{
                      background: 'linear-gradient(135deg, #C9A86C, #8A6835)',
                      color: '#0D0B08',
                      boxShadow: '0 8px 30px rgba(180,130,40,0.4)',
                    }}
                  >
                    {isSubmitting ? (
                      <span>Sipariş Hazırlanıyor...</span>
                    ) : (
                      <>
                        <span>Siparişi Onayla ({pricing.totalPrice.toLocaleString('tr-TR')} {product.currency})</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
