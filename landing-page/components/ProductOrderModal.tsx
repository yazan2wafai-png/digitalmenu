'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  X,
  Sparkles,
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
  locale?: 'tr' | 'en';
}

const COLOR_OPTIONS: { id: ProductColor; label: string; desc: string; previewClass: string }[] = [
  {
    id: 'black',
    label: 'Mat Siyah',
    desc: 'Lüks obsidyen mat zemin, çizilmez dokulu',
    previewClass: 'bg-neutral-900 border-neutral-700',
  },
  {
    id: 'white',
    label: 'Parlak Beyaz',
    desc: 'Kar beyazı pürüzsüz akrilik, yüksek kontrastlı',
    previewClass: 'bg-white border-neutral-300',
  },
  {
    id: 'transparent',
    label: 'Kristal Şeffaf',
    desc: 'Cam berraklığında 5mm dökme pleksiglas',
    previewClass: 'bg-gradient-to-tr from-cyan-400/30 to-white/40 border-cyan-400/60',
  },
];

export function ProductOrderModal({
  product,
  initialColor = 'black',
  isOpen,
  onClose,
  locale = 'tr',
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

  // Reset or adjust min qty when product changes
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
      // Prepared for Claude's backend order endpoint
      // We also save locally to localStorage as backup
      const existingOrders = JSON.parse(localStorage.getItem('nfc_orders') || '[]');
      existingOrders.push(orderPayload);
      localStorage.setItem('nfc_orders', JSON.stringify(existingOrders));

      // Simulate rapid server dispatch
      await new Promise((resolve) => setTimeout(resolve, 800));

      setOrderNumber(generatedOrderId);
      setIsSuccess(true);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#ec4899', '#3b82f6', '#10b981'],
      });
    } catch (err) {
      console.error('Order submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Dark Backdrop */}
        <motion.div
          className="fixed inset-0 bg-black/85 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal Window Container */}
        <motion.div
          className="relative w-full max-w-4xl bg-neutral-900/95 border border-white/15 rounded-3xl overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.8)] z-10 my-auto text-white flex flex-col max-h-[92vh]"
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Top Bar with Close Button */}
          <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-neutral-900/90 backdrop-blur-md border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-300">
                {locale === 'tr' ? 'Özelleştirme & Sipariş Konfigüratörü' : 'Customizer & Order Portal'}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content Scroll Area */}
          <div className="overflow-y-auto p-6 space-y-8 flex-1">
            {isSuccess ? (
              /* Success Celebration State */
              <motion.div
                className="py-12 text-center space-y-6 max-w-md mx-auto"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400 shadow-xl shadow-emerald-500/20">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight mb-2">
                    {locale === 'tr' ? 'Siparişiniz Başarıyla Alındı!' : 'Order Placed Successfully!'}
                  </h3>
                  <p className="text-sm text-white/60 leading-relaxed">
                    {locale === 'tr'
                      ? `Sipariş Numaranız: ${orderNumber}. Tasarım ekibimiz logonuzu işleyip 24 saat içinde onayınız için sizinle iletişime geçecektir.`
                      : `Order ID: ${orderNumber}. Our design studio will prepare your vector proof and reach out within 24 hours.`}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left space-y-2 text-xs text-white/80">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-white/40">Ürün:</span>
                    <span className="font-semibold">{product.name}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-white/40">Varyant / Adet:</span>
                    <span>{selectedColor.toUpperCase()} — {quantity} Adet</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-white/40">Toplam Tutar:</span>
                    <span className="font-bold text-emerald-400">{pricing.totalPrice.toLocaleString('tr-TR')} {product.currency}</span>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="w-full py-3.5 rounded-2xl bg-white text-black font-bold text-sm hover:bg-neutral-200 transition-colors shadow-lg"
                >
                  {locale === 'tr' ? 'Tamam & Kapat' : 'Close'}
                </button>
              </motion.div>
            ) : (
              /* Customizer & Order Form */
              <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Product Visual & Color Selector */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="relative w-full h-64 rounded-2xl overflow-hidden bg-neutral-950 border border-white/10 group">
                    <Image
                      src={currentImage}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs">
                      <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 font-medium">
                        {product.specs.material}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-purple-500/30 backdrop-blur-md border border-purple-500/40 text-purple-200 font-semibold">
                        {selectedColor.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Color Option Selector (Siyah, Beyaz, Şeffaf) */}
                  {product.colors && product.colors.length > 0 && (
                    <div className="space-y-3">
                      <label className="text-xs font-bold uppercase tracking-wider text-white/70 block">
                        {locale === 'tr' ? 'Pleksi Gövde Rengi Seçin' : 'Select Acrylic Color'}
                      </label>
                      <div className="grid grid-cols-3 gap-2.5">
                        {COLOR_OPTIONS.filter((c) => product.colors?.includes(c.id)).map((opt) => {
                          const isSelected = selectedColor === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => setSelectedColor(opt.id)}
                              className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                                isSelected
                                  ? 'bg-purple-600/20 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.25)]'
                                  : 'bg-white/5 border-white/10 hover:border-white/20'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className={`w-5 h-5 rounded-full ${opt.previewClass}`} />
                                {isSelected && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
                              </div>
                              <span className="text-xs font-bold text-white block">{opt.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Quantity Controller with Live Discount */}
                  <div className="space-y-3 p-4 rounded-2xl bg-white/[0.04] border border-white/10">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-white/70">
                        {locale === 'tr' ? 'Sipariş Adedi' : 'Quantity'}
                      </label>
                      {pricing.discountPercentage > 0 && (
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                          %{pricing.discountPercentage} Toptan İndirimi
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center border border-white/15 rounded-xl bg-neutral-950 p-1">
                        <button
                          type="button"
                          onClick={() => handleQtyChange(quantity - 1)}
                          disabled={quantity <= minAllowedQty}
                          className="w-9 h-9 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center font-bold text-base text-white">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQtyChange(quantity + 1)}
                          className="w-9 h-9 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-white/40 block">Birim Fiyat</span>
                        <span className="text-sm font-bold text-white">
                          {pricing.unitPrice.toLocaleString('tr-TR')} {product.currency}
                        </span>
                      </div>
                    </div>

                    {pricing.discountAmount > 0 && (
                      <p className="text-[11px] text-emerald-400/90 font-medium">
                        ✨ Tebrikler! Toplamda {pricing.discountAmount.toLocaleString('tr-TR')} TL tasarruf ediyorsunuz.
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Column: Customization Fields & Customer Details */}
                <div className="lg:col-span-7 space-y-6">
                  <div>
                    <h4 className="text-lg font-bold text-white tracking-tight mb-1">
                      {product.name}
                    </h4>
                    <p className="text-xs text-white/50">{product.tagline}</p>
                  </div>

                  {/* Section 1: Venue / Hardware Personalization */}
                  <div className="space-y-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4" />
                      1. İşletme & Yönlendirme Bilgileri
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-white/70 block mb-1">
                          İşletme / Mekan Adı *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Örn: Kahve Erenköy"
                          value={venueName}
                          onChange={(e) => setVenueName(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950/80 border border-white/15 focus:border-purple-500 focus:outline-none text-sm text-white placeholder:text-white/30"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-white/70 block mb-1">
                          {product.category === 'hardware' && product.id.includes('google')
                            ? 'Google Harita / Yorum Linki'
                            : 'Mevcut Menü / Web Linki'}
                        </label>
                        <input
                          type="url"
                          placeholder="https://g.page/r/..."
                          value={targetUrl}
                          onChange={(e) => setTargetUrl(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950/80 border border-white/15 focus:border-purple-500 focus:outline-none text-sm text-white placeholder:text-white/30"
                        />
                      </div>
                    </div>

                    {/* Logo File Upload Trigger */}
                    <div>
                      <label className="text-xs text-white/70 block mb-1">
                        Logo / Vektörel Tasarım Dosyası (Opsiyonel)
                      </label>
                      <label className="flex items-center justify-between px-4 py-3 rounded-xl border border-dashed border-white/20 hover:border-purple-400 bg-white/[0.02] hover:bg-white/[0.05] cursor-pointer transition-colors">
                        <div className="flex items-center gap-2.5 text-xs text-white/70">
                          <Upload className="w-4 h-4 text-purple-400" />
                          <span>{logoFileName ? `Yüklendi: ${logoFileName}` : 'Logo yüklemek için tıklayın (AI, PDF, SVG, PNG)'}</span>
                        </div>
                        <input
                          type="file"
                          accept=".png,.jpg,.jpeg,.svg,.ai,.pdf,.eps"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                        <span className="text-[11px] font-semibold text-purple-400">Dosya Seç</span>
                      </label>
                      <p className="text-[10px] text-white/40 mt-1">
                        * Logo dosyanız yoksa veya daha sonra göndermek isterseniz sipariş sonrası WhatsApp/Mail ile de alabiliriz.
                      </p>
                    </div>
                  </div>

                  {/* Section 2: Delivery & Contact */}
                  <div className="space-y-4 pt-2 border-t border-white/10">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                      <Truck className="w-4 h-4" />
                      2. İletişim & Fatura / Kargo Bilgileri
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs text-white/70 block mb-1">Ad Soyad *</label>
                        <input
                          type="text"
                          required
                          placeholder="Ad Soyad"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950/80 border border-white/15 focus:border-blue-500 focus:outline-none text-sm text-white placeholder:text-white/30"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-white/70 block mb-1">E-Posta *</label>
                        <input
                          type="email"
                          required
                          placeholder="ornek@sirket.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950/80 border border-white/15 focus:border-blue-500 focus:outline-none text-sm text-white placeholder:text-white/30"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-white/70 block mb-1">Telefon *</label>
                        <input
                          type="tel"
                          required
                          placeholder="05XX XXX XX XX"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950/80 border border-white/15 focus:border-blue-500 focus:outline-none text-sm text-white placeholder:text-white/30"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="text-xs text-white/70 block mb-1">Teslimat Adresi *</label>
                        <input
                          type="text"
                          required
                          placeholder="Mahalle, Cadde, No, İlçe"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950/80 border border-white/15 focus:border-blue-500 focus:outline-none text-sm text-white placeholder:text-white/30"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-white/70 block mb-1">Şehir *</label>
                        <input
                          type="text"
                          required
                          placeholder="İstanbul"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950/80 border border-white/15 focus:border-blue-500 focus:outline-none text-sm text-white placeholder:text-white/30"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Live Order Summary & Checkout Trigger */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-950/40 via-neutral-950 to-blue-950/30 border border-purple-500/20 space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/60">Ara Toplam ({quantity} adet):</span>
                      <span className="font-semibold text-white">
                        {(pricing.unitPrice * quantity).toLocaleString('tr-TR')} {product.currency}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/60">Kargo / Teslimat:</span>
                      <span className="font-semibold text-emerald-400">Ücretsiz (Sigortalı)</span>
                    </div>

                    <div className="border-t border-white/10 pt-3 flex items-baseline justify-between">
                      <div>
                        <span className="text-xs text-white/50 block">Ödenecek Toplam Tutar:</span>
                        <span className="text-2xl font-black text-white tracking-tight">
                          {pricing.totalPrice.toLocaleString('tr-TR')} {product.currency}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-white/60">
                        <Lock className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Güvenli Sipariş</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-500 hover:via-pink-500 hover:to-blue-500 text-white font-black text-sm tracking-wide shadow-xl shadow-purple-600/30 hover:shadow-purple-600/50 transition-all flex items-center justify-center gap-2 transform active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <span>Sipariş Oluşturuluyor...</span>
                      ) : (
                        <>
                          <span>Siparişi Onayla & Tasarıma Başla</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
