import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ Successfully connected to PostgreSQL database');
      await this.ensureSeeded();
    } catch (err) {
      console.error('⚠️ Database connection warning during boot:', (err as Error).message);
    }
  }

  async ensureSeeded() {
    try {
      const baltazarExists = await this.restaurant.findUnique({ where: { slug: 'baltazar' } });
      if (!baltazarExists) {
        console.log('🌱 Auto-seeding Baltazar Burger...');
        const baltazar = await this.restaurant.create({
          data: {
            slug: 'baltazar',
            name: { tr: 'Baltazar Burger', en: 'Baltazar Burger', ar: 'بالتازار برغر' },
            themeColor: '#C0392B',
            logoUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=300&auto=format&fit=crop&q=80',
            supportedLocales: ['tr', 'en', 'ar'],
            defaultLocale: 'tr',
            isActive: true,
            settings: {
              create: {
                currency: 'TRY',
                enableOrdering: true,
                enableTables: true,
                enableAnalytics: true,
                enableMultiLanguage: true,
              },
            },
          },
        });

        const cat1 = await this.category.create({
          data: {
            restaurantId: baltazar.id,
            name: { tr: 'Burgerler', en: 'Burgers', ar: 'برغر' },
            photoUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80',
            sortOrder: 1,
          },
        });

        await this.product.createMany({
          data: [
            {
              categoryId: cat1.id,
              name: { tr: 'Baltazar Classic Burger', en: 'Baltazar Classic Burger', ar: 'كلاسيك برغر' },
              description: { tr: '180g dana köfte, cheddar, karamelize soğan', en: '180g beef patty, cheddar, caramelized onions', ar: '180غ لحم بقر، شيدر، بصل مكرمل' },
              price: 280,
              photoUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80',
              sortOrder: 1,
              isAvailable: true,
            },
            {
              categoryId: cat1.id,
              name: { tr: 'Truffle Mushroom Burger', en: 'Truffle Mushroom Burger', ar: 'برغر فطر الترافل' },
              description: { tr: '180g dana köfte, trüf mantarı sosu, emmental peyniri', en: '180g beef patty, truffle mushroom sauce, emmental cheese', ar: '180غ لحم، صوص الترافل، جبنة إيمنتال' },
              price: 340,
              photoUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&auto=format&fit=crop&q=80',
              sortOrder: 2,
              isAvailable: true,
            },
          ],
        });
        console.log('✅ Baltazar Burger seeded successfully.');
      }

      const erenkoyExists = await this.restaurant.findUnique({ where: { slug: 'kahve-erenkoy' } });
      if (!erenkoyExists) {
        console.log('🌱 Auto-seeding Kahve Erenköy...');
        const erenkoy = await this.restaurant.create({
          data: {
            slug: 'kahve-erenkoy',
            name: { tr: 'Kahve Erenköy', en: 'Kahve Erenkoy', ar: 'كافيه إرينكوي' },
            themeColor: '#6F4E37',
            logoUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=300&auto=format&fit=crop&q=80',
            supportedLocales: ['tr', 'en', 'ar'],
            defaultLocale: 'tr',
            isActive: true,
            settings: {
              create: {
                currency: 'TRY',
                enableOrdering: true,
                enableTables: true,
                enableAnalytics: true,
                enableMultiLanguage: true,
              },
            },
          },
        });

        const coffeeCat = await this.category.create({
          data: {
            restaurantId: erenkoy.id,
            name: { tr: 'Sıcak Kahveler', en: 'Hot Coffees', ar: 'مشروبات ساخنة' },
            photoUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=80',
            sortOrder: 1,
          },
        });

        await this.product.createMany({
          data: [
            {
              categoryId: coffeeCat.id,
              name: { tr: 'V60 Pour Over (Ethiopia)', en: 'V60 Pour Over (Ethiopia)', ar: 'قهوة V60 إثيوبية' },
              description: { tr: 'Çiçeksi aromalar, bergamot ve narenciye notaları', en: 'Floral aromas, bergamot and citrus notes', ar: 'نكهات زهرية ونوتات الحمضيات' },
              price: 140,
              photoUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80',
              sortOrder: 1,
              isAvailable: true,
            },
            {
              categoryId: coffeeCat.id,
              name: { tr: 'Flat White', en: 'Flat White', ar: 'فلات وايت' },
              description: { tr: 'Çift shot espresso ve kadifemsi süt köpüğü', en: 'Double shot espresso with velvety steamed milk', ar: 'جرعة مضاعفة اسبريسو مع حليب مخفوق' },
              price: 120,
              photoUrl: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=800&auto=format&fit=crop&q=80',
              sortOrder: 2,
              isAvailable: true,
            },
          ],
        });
        console.log('✅ Kahve Erenköy seeded successfully.');
      }
    } catch (seedErr) {
      console.warn('⚠️ Auto-seed info:', (seedErr as Error).message);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
