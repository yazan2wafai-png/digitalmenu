/**
 * SEED SCRIPT — BALTAZAR BURGER
 * ================================
 * Translatable fields (name, description) are stored as JSON objects
 * keyed by locale: { "tr": "...", "en": "...", "ar": "..." }
 *
 * Non-translatable fields (slug, price, photoUrl, sortOrder) are plain values.
 * Photo URLs use the pattern /seed-images/placeholder-XX.jpg as stand-ins for real photos.
 *
 * This script is idempotent — safe to run multiple times.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // ---------------------------------------------------------------------------
  // RESTAURANT
  // ---------------------------------------------------------------------------
  const restaurant = await prisma.restaurant.upsert({
    where: { slug: 'baltazar' },
    update: {
      name: { tr: 'Baltazar Burger', en: 'Baltazar Burger', ar: 'بالتازار برغر' },
      supportedLocales: ['tr', 'en', 'ar'],
      defaultLocale: 'tr',
      themeColor: '#C0392B',
      logoUrl: '/seed-images/placeholder-logo.png',
    },
    create: {
      name: { tr: 'Baltazar Burger', en: 'Baltazar Burger', ar: 'بالتازار برغر' },
      slug: 'baltazar',
      themeColor: '#C0392B',
      logoUrl: '/seed-images/placeholder-logo.png',
      supportedLocales: ['tr', 'en', 'ar'],
      defaultLocale: 'tr',
    },
  });
  console.log(`✅ Restaurant: baltazar (id: ${restaurant.id})`);

  // ---------------------------------------------------------------------------
  // CATEGORIES
  // ---------------------------------------------------------------------------
  const categoriesData = [
    {
      name: { tr: 'Burgerler', en: 'Burgers', ar: 'برغر' },
      sortOrder: 1,
    },
    {
      name: { tr: 'Atıştırmalıklar', en: 'Sides', ar: 'مقبلات' },
      sortOrder: 2,
    },
    {
      name: { tr: 'İçecekler', en: 'Drinks', ar: 'مشروبات' },
      sortOrder: 3,
    },
    {
      name: { tr: 'Tatlılar', en: 'Desserts', ar: 'حلويات' },
      sortOrder: 4,
    },
  ];

  // We key categories by their Turkish name for product lookup below
  const categoryIds: Record<string, string> = {};

  for (const cat of categoriesData) {
    const trName = (cat.name as { tr: string }).tr;
    const existing = await prisma.category.findFirst({
      where: { restaurantId: restaurant.id, sortOrder: cat.sortOrder },
    });
    const record = existing
      ? await prisma.category.update({
          where: { id: existing.id },
          data: { name: cat.name, sortOrder: cat.sortOrder },
        })
      : await prisma.category.create({
          data: { name: cat.name, sortOrder: cat.sortOrder, restaurantId: restaurant.id },
        });
    categoryIds[trName] = record.id;
    console.log(`  📂 Category [${cat.sortOrder}]: ${trName}`);
  }

  // ---------------------------------------------------------------------------
  // PRODUCTS
  // ---------------------------------------------------------------------------
  const productsData = [
    // ── Burgerler ──────────────────────────────────────────────────────────────
    {
      category: 'Burgerler',
      name: { tr: 'Klasik Baltazar', en: 'Classic Baltazar', ar: 'كلاسيك بالتازار' },
      description: {
        tr: '180g dana eti, domates, marul, soğan, özel sos.',
        en: '180g beef patty, tomato, lettuce, onion, house sauce.',
        ar: '180 غرام لحم بقري، طماطم، خس، بصل، صوص خاص.',
      },
      price: '220.00',
      photoUrl: '/seed-images/placeholder-01.jpg',
      sortOrder: 1,
    },
    {
      category: 'Burgerler',
      name: { tr: 'Karaköy Smash', en: 'Karaköy Smash', ar: 'كاراكوي سماش' },
      description: {
        tr: 'Çift smash patty, eritilmiş kaşar, turşu, sarımsaklı mayo.',
        en: 'Double smash patty, melted kashkaval, pickles, garlic mayo.',
        ar: 'باتي سماش مزدوج، جبنة كاشكافال مذابة، مخلل، مايونيز بالثوم.',
      },
      price: '260.00',
      photoUrl: '/seed-images/placeholder-02.jpg',
      sortOrder: 2,
    },
    {
      category: 'Burgerler',
      name: { tr: 'BBQ Smoke', en: 'BBQ Smoke', ar: 'بي بي كيو سموك' },
      description: {
        tr: '200g ızgara et, BBQ sos, karamelize soğan, cheddar.',
        en: '200g grilled beef, BBQ sauce, caramelized onion, cheddar.',
        ar: '200 غرام لحم مشوي، صوص باربيكيو، بصل مكرمل، شيدر.',
      },
      price: '280.00',
      photoUrl: '/seed-images/placeholder-03.jpg',
      sortOrder: 3,
    },
    {
      category: 'Burgerler',
      name: { tr: 'Tavuk Baltazar', en: 'Chicken Baltazar', ar: 'دجاج بالتازار' },
      description: {
        tr: 'Çıtır tavuk göğsü, koleslaw, jalapeño, chipotle sos.',
        en: 'Crispy chicken breast, coleslaw, jalapeño, chipotle sauce.',
        ar: 'صدر دجاج مقرمش، كولسلو، هالابينيو، صوص تشيبوتلي.',
      },
      price: '200.00',
      photoUrl: '/seed-images/placeholder-04.jpg',
      sortOrder: 4,
    },
    {
      category: 'Burgerler',
      name: { tr: 'Mantar & Trüf', en: 'Mushroom & Truffle', ar: 'فطر وكمأة' },
      description: {
        tr: 'Sığır eti, sote mantar, trüf mayo, roka.',
        en: 'Beef patty, sautéed mushrooms, truffle mayo, arugula.',
        ar: 'لحم بقري، فطر مقلي، مايونيز الكمأة، جرجير.',
      },
      price: '300.00',
      photoUrl: '/seed-images/placeholder-05.jpg',
      sortOrder: 5,
    },
    // ── Atıştırmalıklar ────────────────────────────────────────────────────────
    {
      category: 'Atıştırmalıklar',
      name: { tr: 'Amerikan Patates', en: 'French Fries', ar: 'بطاطس مقلية' },
      description: {
        tr: 'Altın kıvamında, çıtır çıtır.',
        en: 'Golden and crispy.',
        ar: 'ذهبية ومقرمشة.',
      },
      price: '80.00',
      photoUrl: '/seed-images/placeholder-06.jpg',
      sortOrder: 1,
    },
    {
      category: 'Atıştırmalıklar',
      name: { tr: 'Soğan Halkası', en: 'Onion Rings', ar: 'حلقات بصل' },
      description: {
        tr: 'Beer-battered, ranch sos ile.',
        en: 'Beer-battered, served with ranch dip.',
        ar: 'مغطاة بعجينة البيرة، مع صوص راونش.',
      },
      price: '90.00',
      photoUrl: '/seed-images/placeholder-07.jpg',
      sortOrder: 2,
    },
    {
      category: 'Atıştırmalıklar',
      name: { tr: 'Mozzarella Çubukları', en: 'Mozzarella Sticks', ar: 'أصابع موزاريلا' },
      description: {
        tr: 'Çıtır kaplama, marinara sos.',
        en: 'Crispy breaded, with marinara sauce.',
        ar: 'مقرمشة، مع صوص مارينارا.',
      },
      price: '100.00',
      photoUrl: '/seed-images/placeholder-08.jpg',
      sortOrder: 3,
    },
    // ── İçecekler ──────────────────────────────────────────────────────────────
    {
      category: 'İçecekler',
      name: { tr: 'Klasik Milkshake', en: 'Classic Milkshake', ar: 'ميلك شيك كلاسيك' },
      description: {
        tr: 'Çikolata, çilek veya vanilyalı.',
        en: 'Chocolate, strawberry, or vanilla.',
        ar: 'شوكولاتة أو فراولة أو فانيليا.',
      },
      price: '120.00',
      photoUrl: '/seed-images/placeholder-09.jpg',
      sortOrder: 1,
    },
    {
      category: 'İçecekler',
      name: { tr: 'Limonata', en: 'Lemonade', ar: 'ليمونادة' },
      description: {
        tr: 'Taze sıkılmış, naneli veya sade.',
        en: 'Freshly squeezed, mint or plain.',
        ar: 'طازجة، بالنعناع أو سادة.',
      },
      price: '70.00',
      photoUrl: '/seed-images/placeholder-10.jpg',
      sortOrder: 2,
    },
    {
      category: 'İçecekler',
      name: { tr: 'Soğuk Brew Kahve', en: 'Cold Brew Coffee', ar: 'قهوة كولد برو' },
      description: {
        tr: '24 saat demlenmiş, hafif tatlı.',
        en: 'Steeped 24 hours, lightly sweetened.',
        ar: 'منقوعة 24 ساعة، خفيفة الحلاوة.',
      },
      price: '90.00',
      photoUrl: '/seed-images/placeholder-11.jpg',
      sortOrder: 3,
    },
    // ── Tatlılar ───────────────────────────────────────────────────────────────
    {
      category: 'Tatlılar',
      name: { tr: 'Brownie Sıcak', en: 'Warm Brownie', ar: 'براوني ساخن' },
      description: {
        tr: 'Sıcak çikolatalı brownie, dondurma topuyla.',
        en: 'Warm chocolate brownie with a scoop of ice cream.',
        ar: 'براوني شوكولاتة ساخن مع كرة آيس كريم.',
      },
      price: '130.00',
      photoUrl: '/seed-images/placeholder-12.jpg',
      sortOrder: 1,
    },
    {
      category: 'Tatlılar',
      name: { tr: 'Cheesecake Dilimi', en: 'Cheesecake Slice', ar: 'شريحة تشيز كيك' },
      description: {
        tr: 'New York usulü, çilek soslu.',
        en: 'New York style, with strawberry sauce.',
        ar: 'على الطريقة النيويوركية، مع صوص الفراولة.',
      },
      price: '120.00',
      photoUrl: '/seed-images/placeholder-13.jpg',
      sortOrder: 2,
    },
  ];

  for (const prod of productsData) {
    const catId = categoryIds[prod.category];
    if (!catId) {
      console.warn(`⚠️  Category not found: ${prod.category}`);
      continue;
    }
    const trName = (prod.name as { tr: string }).tr;
    const existing = await prisma.product.findFirst({
      where: { categoryId: catId, sortOrder: prod.sortOrder },
    });
    const record = existing
      ? await prisma.product.update({
          where: { id: existing.id },
          data: {
            name: prod.name,
            description: prod.description,
            price: prod.price,
            photoUrl: prod.photoUrl,
            sortOrder: prod.sortOrder,
          },
        })
      : await prisma.product.create({
          data: {
            categoryId: catId,
            name: prod.name,
            description: prod.description,
            price: prod.price,
            photoUrl: prod.photoUrl,
            sortOrder: prod.sortOrder,
          },
        });
    console.log(`    🍔 [${prod.sortOrder}] ${trName} — ₺${record.price}`);
  }

  // ---------------------------------------------------------------------------
  // ADMIN USER
  // ---------------------------------------------------------------------------
  const bcrypt = await import('bcryptjs');
  const hash = await bcrypt.hash('admin123', 10);
  const admin = await prisma.adminUser.upsert({
    where: { email: 'admin@baltazar.com' },
    update: {},
    create: {
      restaurantId: restaurant.id,
      email: 'admin@baltazar.com',
      passwordHash: hash,
    },
  });
  console.log(`👤 Admin user: ${admin.email}`);

  console.log('✅ Seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
