export type ProductColor = 'black' | 'white' | 'transparent';

export interface BulkTier {
  minQty: number;
  discountPercentage: number;
  label: string;
}

export interface ProductItem {
  id: string;
  name: string;
  nameEn: string;
  category: 'hardware' | 'saas' | 'hybrid';
  categoryLabel: string;
  tagline: string;
  taglineEn: string;
  description: string;
  descriptionEn: string;
  basePrice: number;
  currency: string;
  originalPrice?: number;
  badge?: string;
  popular?: boolean;
  colors?: ProductColor[];
  hasCustomLogo?: boolean;
  hasUrlConfig?: boolean;
  isSubscription?: boolean;
  billingPeriod?: string;
  specs: {
    material: string;
    chipType?: string;
    dimensions: string;
    finish?: string;
    lifespan?: string;
  };
  features: string[];
  featuresEn: string[];
  images: {
    black?: string;
    white?: string;
    transparent?: string;
    default: string;
  };
  bulkTiers?: BulkTier[];
}

export const PRODUCTS: ProductItem[] = [
  {
    id: 'plexi-standart-google-card',
    name: 'Plexi Standart Google Değerlendirme Kartı',
    nameEn: 'Plexiglass Standard Google Review Card',
    category: 'hardware',
    categoryLabel: 'NFC Kart',
    tagline: 'Müşterilerinizin tek dokunuşla 5 yıldızlı Google yorumu bırakmasını sağlayın.',
    taglineEn: 'Enable customers to leave a 5-star Google review with a single contactless tap.',
    description:
      'Özel lazer kesim parlak akrilik gövde ve NTAG213 yüksek hassasiyetli NFC çip. Herhangi bir uygulama veya pil gerektirmez. Müşterileriniz telefonunu yaklaştırdığı anda Google Değerlendirme sayfanız otomatik açılır.',
    descriptionEn:
      'Laser-cut glossy acrylic body with high-sensitivity NTAG213 NFC chip. No apps or batteries required. Instantly opens your Google Review page upon tap.',
    basePrice: 490,
    originalPrice: 650,
    currency: 'TL',
    badge: 'En Çok Satan',
    popular: true,
    colors: ['black', 'white', 'transparent'],
    hasCustomLogo: false,
    hasUrlConfig: true,
    specs: {
      material: '3mm Dökme Akrilik Pleksi',
      chipType: 'NXP NTAG213 (144 bytes, 100k+ okuma)',
      dimensions: '85 x 54 mm (Kredi Kartı Ebatı)',
      finish: 'Parlak Kenar Elmas Polisaj',
      lifespan: '10+ Yıl Veri Saklama',
    },
    features: [
      'Sıfır Kurulum: Google Harita profilinize programlanmış hazır teslimat',
      'Tüm iPhone ve Android cihazlarla %100 uyumlu',
      'Su, aşınma ve UV ışınlarına tam dayanıklı gövde',
      'Karekod (QR) + NFC çift katmanlı yönlendirme',
      'Pil ve uygulama gerektirmez, sınırsız okuma ömrü',
    ],
    featuresEn: [
      'Zero Setup: Delivered pre-programmed to your Google Maps listing',
      '100% compatible with all iPhones and modern Androids',
      'Waterproof, scratch-resistant, UV-protected acrylic body',
      'Dual QR + NFC routing redundancy',
      'No battery or app required, unlimited lifetime taps',
    ],
    images: {
      black: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      white: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80',
      transparent: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&auto=format&fit=crop&q=80',
      default: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    },
    bulkTiers: [
      { minQty: 1, discountPercentage: 0, label: '1 Adet' },
      { minQty: 5, discountPercentage: 15, label: '5+ Adet (%15 İndirim)' },
      { minQty: 10, discountPercentage: 25, label: '10+ Adet (%25 İndirim)' },
      { minQty: 25, discountPercentage: 35, label: '25+ Adet (%35 İndirim)' },
    ],
  },
  {
    id: 'plexi-ozel-tasarim-google-card',
    name: 'Plexi Özel Tasarımlı Google Değerlendirme Kartı',
    nameEn: 'Plexiglass Custom Branded Google Review Card',
    category: 'hardware',
    categoryLabel: 'Bespoke Kart',
    tagline: 'Mekanınızın logosu, kurumsal renkleri ve özel tasarımıyla üretilen premium NFC kart.',
    taglineEn: 'Custom luxury NFC card produced with your venue logo, brand colors, and bespoke UV art.',
    description:
      'İşletmenizin kurumsal kimliğine özel yüksek çözünürlüklü kabartmalı UV baskı. Siyah, Beyaz veya Kristal Şeffaf pleksi seçenekleri. Kartvizit veya masaüstü kullanımına uygun prestijli tasarım.',
    descriptionEn:
      'High-resolution embossed UV print customized to your venue brand identity. Available in Obsidian Black, Crisp White, or Crystal Transparent acrylic.',
    basePrice: 690,
    originalPrice: 890,
    currency: 'TL',
    badge: 'Kurumsal Özel',
    colors: ['black', 'white', 'transparent'],
    hasCustomLogo: true,
    hasUrlConfig: true,
    specs: {
      material: '4mm Premium Dökme Akrilik',
      chipType: 'NXP NTAG213 Yüksek Çekim Bobini',
      dimensions: '85 x 54 mm (Standart) veya Özel Ebat',
      finish: 'Kabartmalı UV Lak Baskı + Polisajlı Kenar',
      lifespan: '10+ Yıl / 100.000+ Dokunuş',
    },
    features: [
      'Mekanınızın logosu, renkleri ve QR kodu ile birebir özel tasarım',
      'Mat Siyah, Parlak Kar Beyazı veya Kristal Şeffaf pleksi gövde',
      'Kabartmalı lak dokusuyla premium elde tutuş hissi',
      'İstediğiniz zaman link güncelleme imkanı (Dinamik Yönlendirme)',
      '1 iş gününde tasarım onayı, 48 saatte kargoya teslim',
    ],
    featuresEn: [
      'Fully custom design with your venue logo, colors, and QR code',
      'Obsidian Matte Black, Pure White, or Crystal Clear acrylic body',
      'Embossed varnish texture for a luxurious tactile touch',
      'Dynamic link reprogramming capabilities at any time',
      '1-day design approval, 48-hour tracked dispatch',
    ],
    images: {
      black: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
      white: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&auto=format&fit=crop&q=80',
      transparent: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&auto=format&fit=crop&q=80',
      default: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
    },
    bulkTiers: [
      { minQty: 1, discountPercentage: 0, label: '1 Adet' },
      { minQty: 3, discountPercentage: 12, label: '3+ Adet (%12 İndirim)' },
      { minQty: 10, discountPercentage: 22, label: '10+ Adet (%22 İndirim)' },
      { minQty: 20, discountPercentage: 32, label: '20+ Adet (%32 İndirim)' },
    ],
  },
  {
    id: 'plexi-l-stand-google',
    name: 'Plexi Özel Tasarımlı Google Değerlendirme L-Stand',
    nameEn: 'Plexiglass Custom Google Review L-Stand',
    category: 'hardware',
    categoryLabel: 'Masa & Kasa Standı',
    tagline: 'Kasa, bar veya masalarınız için 75° ergonomik açılı, lüks akrilik L-Stand.',
    taglineEn: 'Ergonomic 75° angled tabletop & counter acrylic L-stand for instant customer reviews.',
    description:
      'Müşterinin ödeme anında veya masadan kalkarken göz teması kuracağı açıyla tasarlanmış ağır tabanlı akrilik stand. Çift taraflı NTAG215 yüksek menzilli çip entegre edilmiştir.',
    descriptionEn:
      'Weighted luxury acrylic stand angled perfectly for eye contact during checkout or table checkout. Integrated with dual-zone high-gain NTAG215 chips.',
    basePrice: 1250,
    originalPrice: 1690,
    currency: 'TL',
    badge: 'Maksimum Dönüşüm',
    popular: true,
    colors: ['black', 'white', 'transparent'],
    hasCustomLogo: true,
    hasUrlConfig: true,
    specs: {
      material: '5mm Kalın A Sınıfı Pleksiglas',
      chipType: 'NXP NTAG215 (Çift Yönlü Geniş Anten)',
      dimensions: '100 x 150 mm (A6) veya 150 x 210 mm (A5)',
      finish: 'Termoform Büküm, Çizilmez UV Vernik',
      lifespan: 'Ömür Boyu Dayanıklılık',
    },
    features: [
      'Kasa önünde %340 daha fazla Google yorumu toplama başarısı',
      'Ağır tabanı sayesinde masada kaymaz ve devrilmez yapı',
      'Kurumsal logonuz, QR kodunuz ve Google 5 Yıldız grafikleriyle tam baskı',
      'Telefon kılıfı üzerinden dahi anında 4 cm mesafeden algılama',
      'Restoran, kafe, otel, klinik ve güzellik merkezleri için ideal',
    ],
    featuresEn: [
      'Proven to drive 340% more Google reviews right at the payment counter',
      'Heavy weighted base prevents slipping and tipping on tables',
      'Full-bleed custom print with logo, QR code, and Google 5-Star badges',
      'Long-range 4cm detection through thick phone cases',
      'Ideal for restaurants, specialty cafes, hotels, clinics, and salons',
    ],
    images: {
      black: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80',
      white: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&auto=format&fit=crop&q=80',
      transparent: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
      default: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80',
    },
    bulkTiers: [
      { minQty: 1, discountPercentage: 0, label: '1 Adet' },
      { minQty: 3, discountPercentage: 15, label: '3+ Adet (%15 İndirim)' },
      { minQty: 6, discountPercentage: 25, label: '6+ Adet (%25 İndirim)' },
      { minQty: 12, discountPercentage: 35, label: '12+ Adet (%35 İndirim)' },
    ],
  },
  {
    id: 'digital-menu-saas',
    name: 'Dijital Menü SaaS (Akıllı Masadan Sipariş)',
    nameEn: 'Digital Menu SaaS (Smart Table Ordering)',
    category: 'saas',
    categoryLabel: 'Yazılım Platformu',
    tagline: 'Masadan anında sipariş, 3 dil desteği, alerjen filtreleri ve canlı yönetim paneli.',
    taglineEn: 'Instant table ordering, 3 languages, allergen filters, and real-time kitchen dispatch panel.',
    description:
      'Geleneksel kağıt menüleri tarihe gömen yeni nesil menü yazılımı. 3D animasyonlu ürün kartları, masaya özel QR/NFC yönlendirme, garson çağırma, anlık fiyat güncelleme ve Cloudflare CDN destekli ultra hızlı altyapı.',
    descriptionEn:
      'Next-generation menu software replacing paper menus forever. 3D animated cards, table-specific QR/NFC routing, waiter call, instant price sync, and ultra-fast Cloudflare CDN infrastructure.',
    basePrice: 890,
    originalPrice: 1200,
    currency: 'TL',
    badge: 'Aylık / Yıllık Plan',
    isSubscription: true,
    billingPeriod: '/ Ay',
    hasCustomLogo: true,
    hasUrlConfig: false,
    specs: {
      material: 'Bulut Tabanlı Next.js + NestJS + PostgreSQL',
      chipType: 'Tüm NFC donanımlarıyla %100 senkron',
      dimensions: 'Tüm mobil ekranlarla kusursuz duyarlı',
      finish: 'Koyu Mod / Açık Mod / Özel Tema Renkleri',
      lifespan: '%99.99 Uptime Garantisi',
    },
    features: [
      'Masaya Özel Sipariş & Garson Çağırma Modülü',
      '3 Dil Desteği: Türkçe, İngilizce ve Arapça (Otomatik RTL uyumu)',
      'Alerjen, Kalori, Vegan ve Glutensiz filtreleme sistemi',
      'Anında Fiyat & Stok Değiştirme (Tek tıkla tüm masalarda güncellenir)',
      'Gelişmiş Sipariş Takip Ekranı (Mutfak & Kasa Canlı Paneli)',
      'Sınırsız Kategori, Ürün ve Fotoğraf Yükleme',
    ],
    featuresEn: [
      'Table-Specific Ordering & Waiter Call System',
      '3 Languages: Turkish, English, and Arabic (Auto RTL Layout)',
      'Allergen, Calorie, Vegan, and Gluten-free smart filters',
      'Real-time price & stock changes (instant live sync to all tables)',
      'Kitchen & Cashier Live Order Tracker Dashboard',
      'Unlimited categories, products, and high-res photo uploads',
    ],
    images: {
      default: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
    },
    bulkTiers: [
      { minQty: 1, discountPercentage: 0, label: 'Aylık Ödeme (890 TL/Ay)' },
      { minQty: 12, discountPercentage: 20, label: 'Yıllık Ödeme (712 TL/Ay - %20 İndirim)' },
    ],
  },
  {
    id: 'menu-qr-nfc-sticker',
    name: 'Menü QR ve NFC Akıllı Masa Stickerı',
    nameEn: 'Smart Menu QR & NFC Table Sticker',
    category: 'hardware',
    categoryLabel: 'Masa Çözümü',
    tagline: 'Masalarınıza doğrudan yapışan, suya ve dezenfektana dayanıklı 3M akıllı sticker.',
    taglineEn: 'Ultra-durable 3M adhesive smart table sticker resistant to spills, scratches, and disinfectants.',
    description:
      'Özel 3M yapışkanlı, mat koruyucu laminasyon kaplı akıllı NFC masa etiketi. Her masaya özel numara ve QR kod basılır. Silinmeye, deterjana ve alkole karşı 5 yıl garantili koruma.',
    descriptionEn:
      'Matte laminated smart NFC table sticker with heavy-duty 3M adhesive. Custom numbered and QR printed per table. 5-year chemical and disinfectant resistance.',
    basePrice: 95,
    originalPrice: 135,
    currency: 'TL',
    badge: 'Hızlı Uygulama',
    colors: ['black', 'white', 'transparent'],
    hasCustomLogo: true,
    hasUrlConfig: true,
    specs: {
      material: '3M Folyo + Mat Zemin Koruyucu Polikarbon Laminasyon',
      chipType: 'NTAG213 Ultra İnce Bobin',
      dimensions: '70 x 70 mm veya 80 x 80 mm Çap',
      finish: 'Yırtılmaz, Dezenfektan Dayanıklı',
      lifespan: '5+ Yıl Aşınmazlık',
    },
    features: [
      'Masalara saniyeler içinde kolayca yapıştırılır',
      'Restoranınızın logosu ve masa numarası (Masa 1, Masa 2...) ile özel üretim',
      'Çizilmez mat yüzeyi sayesinde ışıkta parlama yapmaz, QR anında okunur',
      'Telefonu üstüne koyduğunuz anda dijital menünüzü açar',
      'Minimum 10 adet siparişle ekonomik masa donanımı',
    ],
    featuresEn: [
      'Applies effortlessly to any table surface in seconds',
      'Custom printed with your logo and unique table numbers (Table 1, 2...)',
      'Glare-free matte finish guarantees instant QR camera scan',
      'Instantly opens the digital table menu when phone is rested on top',
      'Low minimum order quantity of 10 units for high-ROI venues',
    ],
    images: {
      black: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
      white: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800&auto=format&fit=crop&q=80',
      transparent: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&auto=format&fit=crop&q=80',
      default: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
    },
    bulkTiers: [
      { minQty: 10, discountPercentage: 0, label: '10 Adet' },
      { minQty: 25, discountPercentage: 15, label: '25+ Adet (%15 İndirim)' },
      { minQty: 50, discountPercentage: 25, label: '50+ Adet (%25 İndirim)' },
      { minQty: 100, discountPercentage: 35, label: '100+ Adet (%35 İndirim)' },
    ],
  },
  {
    id: 'menu-qr-nfc-plexi-stand',
    name: 'Menü QR ve NFC Plexi Masa Standı',
    nameEn: 'Menu QR & NFC Plexiglass Table Stand',
    category: 'hardware',
    categoryLabel: 'Masaüstü Lüks',
    tagline: 'Masalarda duran, Siyah, Beyaz veya Şeffaf gövde seçenekli prestijli menü bloğu.',
    taglineEn: 'Prestigious tabletop menu acrylic block available in Obsidian Black, Pure White, or Crystal Clear.',
    description:
      'Masalarınızda devrim yaratacak lüks pleksi menü standı. Müşterileriniz telefonlarını standa dokundurarak veya QR kodu taratarak sipariş vermeye başlar. Çift taraflı özel UV baskı.',
    descriptionEn:
      'Luxurious acrylic menu stand that elevates your table ambiance. Guests tap their phones or scan the high-precision QR to start ordering. Double-sided bespoke UV print.',
    basePrice: 340,
    originalPrice: 480,
    currency: 'TL',
    badge: 'Premium Masa',
    popular: true,
    colors: ['black', 'white', 'transparent'],
    hasCustomLogo: true,
    hasUrlConfig: true,
    specs: {
      material: '4mm Ağırlaştırılmış Pleksiglas Gövde',
      chipType: 'NXP NTAG213 / NTAG215 Entegre Anten',
      dimensions: '90 x 120 mm veya 100 x 150 mm',
      finish: 'Elmas Kesim Kenar, Çift Taraflı UV Baskı',
      lifespan: '10+ Yıl Dayanıklılık',
    },
    features: [
      'Siyah, Beyaz veya Kristal Şeffaf akrilik renk opsiyonları',
      'Ön yüzde Dijital Menü, arka yüzde Wi-Fi veya Google Değerlendirme seçeneği',
      'Masa numarası ve işletme logosuyla kişiselleştirilmiş üretim',
      'Ağır yapısıyla dış mekan rüzgarında dahi masada stabil durur',
      'Garson yükünü %45 azaltır, masada sipariş hızını 3 katına çıkarır',
    ],
    featuresEn: [
      'Available in Obsidian Black, Pure White, or Crystal Clear acrylic',
      'Front side Digital Menu, reverse side Wi-Fi Connect or Google Reviews',
      'Personalized with table numbers and custom brand logo',
      'Weighted block design remains rock solid even in outdoor wind',
      'Reduces waiter turnaround by 45%, boosts table ordering speed by 3x',
    ],
    images: {
      black: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80',
      white: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&auto=format&fit=crop&q=80',
      transparent: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
      default: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80',
    },
    bulkTiers: [
      { minQty: 5, discountPercentage: 0, label: '5 Adet' },
      { minQty: 15, discountPercentage: 15, label: '15+ Adet (%15 İndirim)' },
      { minQty: 30, discountPercentage: 25, label: '30+ Adet (%25 İndirim)' },
      { minQty: 50, discountPercentage: 35, label: '50+ Adet (%35 İndirim)' },
    ],
  },
];

export function calculateProductPrice(
  product: ProductItem,
  quantity: number,
): {
  unitPrice: number;
  totalPrice: number;
  discountPercentage: number;
  discountAmount: number;
} {
  let discountPercentage = 0;

  if (product.bulkTiers && product.bulkTiers.length > 0) {
    for (const tier of [...product.bulkTiers].reverse()) {
      if (quantity >= tier.minQty) {
        discountPercentage = tier.discountPercentage;
        break;
      }
    }
  }

  const rawUnit = product.basePrice;
  const unitPrice = Math.round(rawUnit * (1 - discountPercentage / 100));
  const totalPrice = unitPrice * quantity;
  const normalTotal = rawUnit * quantity;
  const discountAmount = normalTotal - totalPrice;

  return {
    unitPrice,
    totalPrice,
    discountPercentage,
    discountAmount,
  };
}
