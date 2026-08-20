import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed for Kahve Erenköy...');

  const passwordHash = await bcrypt.hash('erenkoy123', 10);

  // 1. Restaurant
  const restaurant = await prisma.restaurant.upsert({
    where: { slug: 'kahve-erenkoy' },
    update: {
      name: { tr: 'Kahve Erenköy', en: 'Kahve Erenkoy', ar: 'كافيه إرينكوي' },
      themeColor: '#6F4E37',
      logoUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=300&auto=format&fit=crop&q=80',
      supportedLocales: ['tr', 'en', 'ar'],
      defaultLocale: 'tr',
      isActive: true,
    },
    create: {
      name: { tr: 'Kahve Erenköy', en: 'Kahve Erenkoy', ar: 'كافيه إرينكوي' },
      slug: 'kahve-erenkoy',
      themeColor: '#6F4E37',
      logoUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=300&auto=format&fit=crop&q=80',
      supportedLocales: ['tr', 'en', 'ar'],
      defaultLocale: 'tr',
      isActive: true,
    },
  });
  console.log(`✅ Restaurant: ${restaurant.slug} (ID: ${restaurant.id})`);

  // 2. Admin User
  const admin = await prisma.adminUser.upsert({
    where: { email: 'admin@kahveerenkoy.com' },
    update: {
      restaurantId: restaurant.id,
      passwordHash,
      role: 'RESTAURANT_ADMIN',
    },
    create: {
      restaurantId: restaurant.id,
      email: 'admin@kahveerenkoy.com',
      passwordHash,
      role: 'RESTAURANT_ADMIN',
    },
  });
  console.log(`👤 Admin user: ${admin.email}`);

  // 3. Settings
  await prisma.restaurantSettings.upsert({
    where: { restaurantId: restaurant.id },
    update: {
      orderingEnabled: true,
      dineInEnabled: true,
      takeawayEnabled: true,
      estimatedPrepMinutes: 10,
      currency: 'TRY',
      timezone: 'Europe/Istanbul',
    },
    create: {
      restaurantId: restaurant.id,
      orderingEnabled: true,
      dineInEnabled: true,
      takeawayEnabled: true,
      estimatedPrepMinutes: 10,
      currency: 'TRY',
      timezone: 'Europe/Istanbul',
    },
  });
  console.log(`⚙️ Settings configured`);

  // 4. Locations & Tables
  const locationsData = [
    { name: 'Ana Salon', isDefault: true, tables: ['T-1', 'T-2', 'T-3', 'T-4', 'T-5'] },
    { name: 'Bahçe', isDefault: false, tables: ['B-1', 'B-2', 'B-3'] },
  ];

  for (const locData of locationsData) {
    let location = await prisma.location.findFirst({
      where: { restaurantId: restaurant.id, name: locData.name },
    });
    if (!location) {
      location = await prisma.location.create({
        data: {
          restaurantId: restaurant.id,
          name: locData.name,
          isDefault: locData.isDefault,
        },
      });
    }
    console.log(`📍 Location: ${location.name}`);

    for (const tableName of locData.tables) {
      const existingTable = await prisma.table.findFirst({
        where: { locationId: location.id, name: tableName },
      });
      if (!existingTable) {
        await prisma.table.create({
          data: {
            locationId: location.id,
            restaurantId: restaurant.id,
            name: tableName,
          },
        });
      }
    }
    console.log(`  🪑 Created ${locData.tables.length} tables in ${location.name}`);
  }

  // 5. Categories
  const categoriesData = [
    {
      name: { tr: 'Sıcak Kahveler', en: 'Hot Coffees', ar: 'قهوة ساخنة' },
      sortOrder: 1,
    },
    {
      name: { tr: 'Soğuk Kahveler', en: 'Cold Brews & Iced Coffees', ar: 'قهوة باردة' },
      sortOrder: 2,
    },
    {
      name: { tr: 'Fırından & Tatlılar', en: 'Bakery & Desserts', ar: 'حلويات ومخبوزات' },
      sortOrder: 3,
    },
    {
      name: { tr: 'Özel İçecekler & Çaylar', en: 'Signature Drinks & Teas', ar: 'شاي ومشروبات خاصة' },
      sortOrder: 4,
    },
  ];

  const categoryMap: Record<string, string> = {};
  for (const catData of categoriesData) {
    const trName = catData.name.tr;
    let category = await prisma.category.findFirst({
      where: { restaurantId: restaurant.id, sortOrder: catData.sortOrder },
    });
    if (category) {
      category = await prisma.category.update({
        where: { id: category.id },
        data: { name: catData.name, sortOrder: catData.sortOrder },
      });
    } else {
      category = await prisma.category.create({
        data: { restaurantId: restaurant.id, name: catData.name, sortOrder: catData.sortOrder },
      });
    }
    categoryMap[trName] = category.id;
    console.log(`📂 Category [${catData.sortOrder}]: ${trName}`);
  }

  // 6. Products
  const productsData = [
    // Sıcak Kahveler
    {
      category: 'Sıcak Kahveler',
      name: { tr: 'Espresso Single / Double', en: 'Espresso Single / Double', ar: 'إسبريسو سينجل / دبل' },
      description: {
        tr: '%100 Arabica taze kavrulmuş çekirdeklerden yoğun aroma.',
        en: 'Rich extraction from 100% Arabica freshly roasted beans.',
        ar: 'مستخلص كفيف من بن أرابيكا 100% محمص طازجاً.',
      },
      price: '75.00',
      photoUrl: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600&auto=format&fit=crop&q=80',
      sortOrder: 1,
    },
    {
      category: 'Sıcak Kahveler',
      name: { tr: 'Flat White', en: 'Flat White', ar: 'فلات وايت' },
      description: {
        tr: 'Çift shot espresso ve kadifemsi köpüklü süt.',
        en: 'Double shot espresso with velvety micro-foam milk.',
        ar: 'جرعتان إسبريسو مع حليب مخفوق مخملي.',
      },
      price: '110.00',
      photoUrl: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=600&auto=format&fit=crop&q=80',
      sortOrder: 2,
    },
    {
      category: 'Sıcak Kahveler',
      name: { tr: 'V60 Pour Over', en: 'V60 Pour Over', ar: 'V60 تقطير' },
      description: {
        tr: 'Single origin Etiyopya Yirgacheffe çekirdeği ile özel demleme.',
        en: 'Hand-poured single origin Ethiopia Yirgacheffe coffee.',
        ar: 'قهوة إثيوبيا ييرغاتشيف من مصدر واحد محضرة يدوياً.',
      },
      price: '135.00',
      photoUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80',
      sortOrder: 3,
    },
    // Soğuk Kahveler
    {
      category: 'Soğuk Kahveler',
      name: { tr: 'Iced Spanish Latte', en: 'Iced Spanish Latte', ar: 'سبانيش لاتيه بارد' },
      description: {
        tr: 'Espresso, soğuk süt ve tatlandırılmış yoğunlaştırılmış süt karışımı.',
        en: 'Espresso, cold milk and sweetened condensed milk over ice.',
        ar: 'إسبريسو مع حليب بارد وحليب مكثف محلى over ثلج.',
      },
      price: '140.00',
      photoUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop&q=80',
      sortOrder: 1,
    },
    {
      category: 'Soğuk Kahveler',
      name: { tr: 'Cold Brew', en: 'Cold Brew', ar: 'كولد برو' },
      description: {
        tr: '16 saat soğuk demleme tekniğiyle hazırlanmış pürüzsüz içim.',
        en: 'Smooth 16-hour cold steep specialty coffee.',
        ar: 'قهوة كولد برو منقوعة باردة لمدة 16 ساعة ناعمة المذاق.',
      },
      price: '125.00',
      photoUrl: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=600&auto=format&fit=crop&q=80',
      sortOrder: 2,
    },
    // Fırından & Tatlılar
    {
      category: 'Fırından & Tatlılar',
      name: { tr: 'San Sebastian Cheesecake', en: 'San Sebastian Cheesecake', ar: 'سان سيباستيان تشيز كيك' },
      description: {
        tr: 'İçi kremsi, üstü yanık klasik Bask cheesecake dilimi.',
        en: 'Creamy inside with a caramelized burnt Basque top.',
        ar: 'تشيز كيك باسك كريمي من الداخل ومحروق كلاسيكي.',
      },
      price: '160.00',
      photoUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&auto=format&fit=crop&q=80',
      sortOrder: 1,
    },
    {
      category: 'Fırından & Tatlılar',
      name: { tr: 'Taze Tereyağlı Kruvasan', en: 'Fresh Butter Croissant', ar: 'كرواسون زبدة طازج' },
      description: {
        tr: 'Günlük fırından çıkan kat kat çıtır Fransız kruvasanı.',
        en: 'Flaky daily baked French butter croissant.',
        ar: 'كرواسون فرنسي طازج بالزبدة مقرمش متعدد الطبقات.',
      },
      price: '85.00',
      photoUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80',
      sortOrder: 2,
    },
    {
      category: 'Fırından & Tatlılar',
      name: { tr: 'Yaban Mersinli Danish', en: 'Blueberry Danish', ar: 'دانيش التوت الأزرق' },
      description: {
        tr: 'Taze yaban mersini dolgulu ve vanilya kremalı çıtır danish.',
        en: 'Pastry topped with fresh blueberries and vanilla custard.',
        ar: 'معجنات دانيش بحشوة التوت الأزرق وكريمة الفانيليا.',
      },
      price: '95.00',
      photoUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
      sortOrder: 3,
    },
    // Özel İçecekler & Çaylar
    {
      category: 'Özel İçecekler & Çaylar',
      name: { tr: 'Iced Japanese Matcha Latte', en: 'Iced Japanese Matcha Latte', ar: 'ماتشا لاتيه بارد' },
      description: {
        tr: 'Uji seremoniyel derece organik matcha ve yulaf sütü.',
        en: 'Ceremonial grade Uji organic matcha with oat milk over ice.',
        ar: 'ماتشا عضوية درجة احتفالية مع حليب الشوفان والثلج.',
      },
      price: '150.00',
      photoUrl: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&auto=format&fit=crop&q=80',
      sortOrder: 1,
    },
    {
      category: 'Özel İçecekler & Çaylar',
      name: { tr: 'Demleme Hibiskus Çayı', en: 'Brewed Hibiscus Tea', ar: 'شاي كركديه بارد' },
      description: {
        tr: 'Taze nane ve çubuk tarçın eşliğinde soğuk demlenmiş hibiskus.',
        en: 'Cold brewed hibiscus tea served with fresh mint and cinnamon.',
        ar: 'شاي كركديه بارد منقوع مع نعناع طازج وقرفة.',
      },
      price: '90.00',
      photoUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&auto=format&fit=crop&q=80',
      sortOrder: 2,
    },
  ];

  for (const prodData of productsData) {
    const catId = categoryMap[prodData.category];
    if (!catId) continue;

    const existingProduct = await prisma.product.findFirst({
      where: { categoryId: catId, sortOrder: prodData.sortOrder },
    });

    if (existingProduct) {
      await prisma.product.update({
        where: { id: existingProduct.id },
        data: {
          name: prodData.name,
          description: prodData.description,
          price: prodData.price,
          photoUrl: prodData.photoUrl,
          sortOrder: prodData.sortOrder,
        },
      });
    } else {
      await prisma.product.create({
        data: {
          categoryId: catId,
          name: prodData.name,
          description: prodData.description,
          price: prodData.price,
          photoUrl: prodData.photoUrl,
          sortOrder: prodData.sortOrder,
        },
      });
    }
    console.log(`  🍔 [${prodData.sortOrder}] ${prodData.name.tr} — ₺${prodData.price}`);
  }

  console.log('✅ Kahve Erenköy Seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
