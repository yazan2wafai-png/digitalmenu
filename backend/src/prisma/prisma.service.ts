import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit(): Promise<void> {
    try {
      await this.$connect();
      console.log('✅ Successfully connected to PostgreSQL database');
      await this.ensureSeeded();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('⚠️ Database connection warning during boot:', msg);
    }
  }

  async ensureSeeded(): Promise<void> {
    try {
      const defaultPasswordHash = await bcrypt.hash('admin123', 10);
      const erenkoyPasswordHash = await bcrypt.hash('erenkoy123', 10);

      let baltazar = await this.restaurant.findUnique({ where: { slug: 'baltazar' } });
      if (!baltazar) {
        console.log('🌱 Auto-seeding Baltazar Burger...');
        baltazar = await this.restaurant.create({
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
                canManageMenu: true,
                canViewOrders: true,
                canTrackTables: true,
                canManageStaff: true,
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

      // Ensure Baltazar admin user exists
      await this.adminUser.upsert({
        where: { email: 'admin@baltazar.com' },
        update: { restaurantId: baltazar.id },
        create: {
          restaurantId: baltazar.id,
          email: 'admin@baltazar.com',
          passwordHash: defaultPasswordHash,
          role: 'RESTAURANT_ADMIN',
          staffRole: 'OWNER',
        },
      });

      let erenkoy = await this.restaurant.findUnique({ where: { slug: 'kahve-erenkoy' } });
      if (!erenkoy) {
        console.log('🌱 Auto-seeding Kahve Erenköy...');
        erenkoy = await this.restaurant.create({
          data: {
            slug: 'kahve-erenkoy',
            name: { tr: 'Kahve Erenköy', en: 'Kahve Erenkoy' },
            themeColor: '#6F4E37',
            logoUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=300&auto=format&fit=crop&q=80',
            supportedLocales: ['tr', 'en'],
            defaultLocale: 'tr',
            isActive: true,
            settings: {
              create: {
                currency: 'TRY',
                enableOrdering: true,
                enableTables: true,
                enableAnalytics: true,
                enableMultiLanguage: true,
                canManageMenu: true,
                canViewOrders: true,
                canTrackTables: true,
                canManageStaff: true,
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

      // Ensure Kahve Erenkoy admin users exist and are linked
      await this.adminUser.upsert({
        where: { email: 'admin@kahveerenkoy.com' },
        update: { restaurantId: erenkoy.id },
        create: {
          restaurantId: erenkoy.id,
          email: 'admin@kahveerenkoy.com',
          passwordHash: erenkoyPasswordHash,
          role: 'RESTAURANT_ADMIN',
          staffRole: 'OWNER',
        },
      });

      await this.adminUser.upsert({
        where: { email: 'admin@erenkoy.com' },
        update: { restaurantId: erenkoy.id },
        create: {
          restaurantId: erenkoy.id,
          email: 'admin@erenkoy.com',
          passwordHash: erenkoyPasswordHash,
          role: 'RESTAURANT_ADMIN',
          staffRole: 'OWNER',
        },
      });

      // Ensure Super Admin exists
      await this.adminUser.upsert({
        where: { email: 'admin@digitalmenu.com' },
        update: {},
        create: {
          email: 'admin@digitalmenu.com',
          passwordHash: defaultPasswordHash,
          role: 'SUPER_ADMIN',
          staffRole: 'OWNER',
        },
      });
    } catch (seedErr: unknown) {
      const msg = seedErr instanceof Error ? seedErr.message : String(seedErr);
      console.warn('⚠️ Auto-seed info:', msg);
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
