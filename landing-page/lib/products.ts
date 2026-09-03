export type ProductColor = 'black' | 'white' | 'transparent';

export interface BulkTier {
  minQty: number;
  discountPercentage: number;
  label: string;
}

export interface ProductItem {
  id: string;
  name: string;
  category: 'hardware' | 'saas' | 'bundle';
  categoryLabel: string;
  tagline: string;
  description: string;
  basePrice: number;
  originalPrice?: number;
  currency: string;
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
  images: {
    black?: string;
    white?: string;
    transparent?: string;
    default: string;
  };
  bulkTiers?: BulkTier[];
}

export const MAIN_PRODUCTS: ProductItem[] = [
  {
    id: 'plexi-google-review-card',
    name: 'Plexi Google Değerlendirme Kartı',
    category: 'hardware',
    categoryLabel: 'NFC Kart',
    tagline: 'Müşterilerinizin tek dokunuşla 5 yıldızlı Google yorumu bırakmasını sağlayın.',
    description:
      'Özel lazer kesim akrilik pleksi gövde ve yüksek çekimli NXP NTAG213 NFC çip. Standart şık tasarım veya mekanınıza özel kurumsal UV baskı seçeneği.',
    basePrice: 1000,
    originalPrice: 1350,
    currency: 'TL',
    badge: 'En Popüler',
    popular: true,
    colors: ['black', 'white', 'transparent'],
    hasCustomLogo: true,
    hasUrlConfig: true,
    specs: {
      material: '3mm / 4mm Dökme Akrilik Pleksi',
      chipType: 'NXP NTAG213 (144 bytes, 100k+ okuma)',
      dimensions: '85 x 54 mm (Kredi Kartı Ebatı)',
      finish: 'Parlak Elmas Polisaj + Kabartmalı UV Baskı',
      lifespan: '10+ Yıl Veri Saklama',
    },
    features: [
      'Standart (1.000 TL) veya Kurumsal Özel Tasarım (1.400 TL) opsiyonu',
      'Tüm iPhone ve modern Android cihazlarla %100 uyumlu',
      'Suya, çizilmeye ve güneş ışığına tam dayanıklı',
      'Karekod (QR) + NFC çift katmanlı yönlendirme',
      'Pil ve uygulama gerektirmez, sınırsız ömür boyu dokunuş',
    ],
    images: {
      black: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      white: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80',
      transparent: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&auto=format&fit=crop&q=80',
      default: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    },
    bulkTiers: [
      { minQty: 1, discountPercentage: 0, label: '1 Adet (1.000 TL)' },
      { minQty: 3, discountPercentage: 15, label: '3+ Adet (%15 İndirim)' },
      { minQty: 10, discountPercentage: 25, label: '10+ Adet (%25 İndirim)' },
    ],
  },
  {
    id: 'plexi-l-stand-google',
    name: 'Plexi Özel Tasarımlı Google Değerlendirme L-Stand',
    category: 'hardware',
    categoryLabel: 'Kasa & Masa Standı',
    tagline: 'Kasa ve masalarınız için 75° açılı, ağır tabanlı lüks akrilik L-Stand.',
    description:
      'Ödeme anında müşterilerin göz hizasında duran açılı ve ağırlıklı pleksi stand. Çift yönlü NXP NTAG215 yüksek menzilli çip entegrelidir.',
    basePrice: 1700,
    originalPrice: 2200,
    currency: 'TL',
    badge: 'Maksimum Yorum',
    popular: true,
    colors: ['black', 'white', 'transparent'],
    hasCustomLogo: true,
    hasUrlConfig: true,
    specs: {
      material: '5mm Kalın A Sınıfı Ağır Pleksiglas',
      chipType: 'NXP NTAG215 (Geniş Çift Bobin)',
      dimensions: '100 x 150 mm (A6 Masa/Kasa Ebatı)',
      finish: 'Termoform Büküm, Çizilmez UV Vernik',
      lifespan: 'Ömür Boyu Dayanıklılık',
    },
    features: [
      'Kasa önünde %340 daha fazla Google yorumu toplama garantisi',
      'Ağır tabanı sayesinde devrilmez ve kaymaz yapı',
      'Logonuz, kurumsal renkleriniz ve QR kodunuzla özel baskı',
      'Telefon kılıfı arkasından anında 4 cm mesafeden algılama',
      'Restoran, kafe, otel, klinik ve güzellik merkezleri için ideal',
    ],
    images: {
      black: '/products/lstand-mockup.png',
      white: '/products/lstand-mockup.png',
      transparent: '/products/lstand-mockup.png',
      default: '/products/lstand-mockup.png',
    },
    bulkTiers: [
      { minQty: 1, discountPercentage: 0, label: '1 Adet (1.700 TL)' },
      { minQty: 3, discountPercentage: 15, label: '3+ Adet (%15 İndirim)' },
      { minQty: 6, discountPercentage: 25, label: '6+ Adet (%25 İndirim)' },
    ],
  },
  {
    id: 'digital-menu-saas',
    name: 'Dijital Menü SaaS (Akıllı Masadan Sipariş)',
    category: 'saas',
    categoryLabel: 'Yazılım & Menü Sistemi',
    tagline: 'Masadan anında sipariş, 3 dil desteği, garson çağırma ve canlı mutfak paneli.',
    description:
      'Geleneksel kağıt menüleri tarihe gömen yeni nesil menü yazılımı. 3D animasyonlu ürün kartları, masaya özel QR/NFC yönlendirme, anlık fiyat güncelleme ve Cloudflare CDN destekli altyapı.',
    basePrice: 5000,
    originalPrice: 7500,
    currency: 'TL',
    badge: 'Yıllık Lisans',
    isSubscription: true,
    billingPeriod: '/ Yıl',
    hasCustomLogo: true,
    hasUrlConfig: false,
    specs: {
      material: 'Bulut Tabanlı Next.js + NestJS + PostgreSQL',
      chipType: 'Tüm NFC donanımlarıyla %100 senkron',
      dimensions: 'Tüm mobil ekranlarla duyarlı',
      finish: 'Özel Kurumsal Marka Teması',
      lifespan: '%99.99 Uptime Garantisi',
    },
    features: [
      'Masaya Özel Sipariş & Garson Çağırma Sistemi',
      '3 Dil Desteği: Türkçe, İngilizce ve Arapça (Otomatik RTL uyumu)',
      'Alerjen, Kalori, Vegan ve Glutensiz filtreleme sistemi',
      'Anında Fiyat & Stok Değiştirme (Tüm masalarda tek tıkla canlı güncellenir)',
      'Mutfak & Kasa Canlı Sipariş Takip Paneli',
      'Sınırsız Kategori, Ürün ve Görsel Yükleme Hakkı',
    ],
    images: {
      default: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
    },
    bulkTiers: [
      { minQty: 1, discountPercentage: 0, label: '1 Yıllık Lisans (5.000 TL)' },
      { minQty: 2, discountPercentage: 20, label: '2 Yıllık Lisans (%20 İndirim)' },
    ],
  },
  {
    id: 'vip-all-in-one-bundle',
    name: 'Toplam VIP Ekosistem Paketi (Hepsi Bir Arada)',
    category: 'bundle',
    categoryLabel: 'VIP Full Paket',
    tagline: 'L-Stand + Özel Pleksi Kartlar + Masa Donanımları + 1 Yıllık Dijital Menü SaaS.',
    description:
      'Mekanınızın hem Google değerlendirme hem de masadan sipariş altyapısını eksiksiz kuran hepsi bir arada anahtar teslim VIP paket.',
    basePrice: 6900,
    originalPrice: 9600,
    currency: 'TL',
    badge: 'En Karlı Seçim • %28 Tasarruf',
    popular: true,
    colors: ['black', 'white', 'transparent'],
    hasCustomLogo: true,
    hasUrlConfig: true,
    specs: {
      material: 'L-Stand + 2x Kart + 20x Masa Sticker/Pleksi + Full SaaS',
      chipType: 'NTAG213 / NTAG215 Yüksek Çekimli Çipler',
      dimensions: 'Eksiksiz Restoran & Kafe Seti',
      finish: 'Birebir Özel Kurumsal UV Baskı',
      lifespan: 'Ömür Boyu Donanım + 1 Yıl SaaS',
    },
    features: [
      '1 Adet Özel Tasarımlı Google Değerlendirme L-Stand (1.700 TL değerinde)',
      '2 Adet Özel Tasarımlı Pleksi Google Kartı (2.800 TL değerinde)',
      '20 Adet Akıllı Menü QR & NFC Masa Donanımı (Sticker / Pleksi)',
      '1 Yıllık Sınırsız Dijital Menü SaaS Masadan Sipariş Sistemi (5.000 TL değerinde)',
      'Ücretsiz Kurumsal Logo & Tasarım Desteği ve Öncelikli Kargo',
    ],
    images: {
      black: '/products/lstand-mockup.png',
      white: '/products/lstand-mockup.png',
      transparent: '/products/lstand-mockup.png',
      default: '/products/lstand-mockup.png',
    },
    bulkTiers: [
      { minQty: 1, discountPercentage: 0, label: '1 Şube Paketi (6.900 TL)' },
      { minQty: 2, discountPercentage: 15, label: '2+ Şube Paketi (%15 İndirim)' },
    ],
  },
];

export const ALL_PRODUCTS: ProductItem[] = [
  ...MAIN_PRODUCTS,
  {
    id: 'plexi-ozel-tasarim-google-card',
    name: 'Plexi Özel Tasarımlı Google Değerlendirme Kartı',
    category: 'hardware',
    categoryLabel: 'Bespoke Kart',
    tagline: 'Logonuz ve özel UV baskınızla üretilen kurumsal NFC kart.',
    description: 'Kabartmalı UV lak baskılı, mat siyah, beyaz veya şeffaf pleksi seçenekli özel kart.',
    basePrice: 1400,
    originalPrice: 1800,
    currency: 'TL',
    colors: ['black', 'white', 'transparent'],
    hasCustomLogo: true,
    hasUrlConfig: true,
    specs: {
      material: '4mm Premium Dökme Akrilik',
      chipType: 'NXP NTAG213 Yüksek Çekim Bobini',
      dimensions: '85 x 54 mm',
      finish: 'Kabartmalı UV Lak Baskı',
    },
    features: ['Birebir kurumsal logonuz ve renkleriniz', 'Kabartmalı lak dokusu', 'Sınırsız okuma ömrü'],
    images: {
      default: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
    },
  },
  {
    id: 'menu-qr-nfc-sticker',
    name: 'Menü QR ve NFC Akıllı Masa Stickerı',
    category: 'hardware',
    categoryLabel: 'Masa Donanımı',
    tagline: 'Suya ve dezenfektana dayanıklı 3M akıllı masa stickerı.',
    description: 'Masalara özel numaralandırılmış, çizilmez mat korumalı 3M NFC etiket.',
    basePrice: 150,
    originalPrice: 200,
    currency: 'TL',
    hasCustomLogo: true,
    hasUrlConfig: true,
    specs: {
      material: '3M Folyo + Polikarbon Koruma',
      chipType: 'NTAG213 Ultra İnce',
      dimensions: '70 x 70 mm',
    },
    features: ['Masaya özel numara basımı', 'Kimyasala dayanıklı', 'Hızlı ve pratik uygulama'],
    images: {
      default: '/products/masa-stickeri-mockup.png',
    },
  },
  {
    id: 'menu-qr-nfc-plexi-stand',
    name: 'Menü QR ve NFC Plastik / Pleksi Masa Bloğu',
    category: 'hardware',
    categoryLabel: 'Masaüstü Stand',
    tagline: 'Masalarda duran şık ve dayanıklı çift taraflı menü bloğu.',
    description: 'Ön yüzde menü, arka yüzde Wi-Fi veya Google değerlendirme bulunan 4mm pleksi blok.',
    basePrice: 250,
    originalPrice: 350,
    currency: 'TL',
    colors: ['black', 'white', 'transparent'],
    hasCustomLogo: true,
    hasUrlConfig: true,
    specs: {
      material: '4mm Pleksiglas Gövde',
      chipType: 'NXP NTAG213',
      dimensions: '90 x 120 mm',
    },
    features: ['Çift taraflı UV baskı', 'Rüzgarda devrilmez ağır yapı', 'Garson yükünü %45 azaltır'],
    images: {
      default: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80',
    },
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
