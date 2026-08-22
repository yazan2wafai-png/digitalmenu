const BACKEND_URL = process.env.BACKEND_URL || 'https://digitalmenu-backend-production.up.railway.app';

const categoriesData = [
  {
    name: { tr: 'Sıcak Kahveler', en: 'Hot Coffees' },
    photoUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=80',
    sortOrder: 1,
    products: [
      {
        name: { tr: 'Espresso Single / Double', en: 'Espresso Single / Double' },
        description: {
          tr: '%100 Arabica taze çekilmiş çekirdeklerden yoğun gövde ve fındık rengi krema.',
          en: 'Rich body and nutty crema crafted from 100% freshly ground Arabica beans.',
        },
        price: '75.00',
        photoUrl: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=800&auto=format&fit=crop&q=80',
        sortOrder: 1,
      },
      {
        name: { tr: 'V60 Pour Over', en: 'V60 Pour Over' },
        description: {
          tr: 'Single origin Etiyopya Yirgacheffe çekirdekleri, narenciye ve bergamot notalarıyla el demleme.',
          en: 'Hand-poured single origin Ethiopian Yirgacheffe with bright citrus and floral bergamot notes.',
        },
        price: '135.00',
        photoUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80',
        sortOrder: 2,
      },
      {
        name: { tr: 'Flat White', en: 'Flat White' },
        description: {
          tr: 'Çift shot ristretto espresso ve kadifemsi mikro süt köpüğü.',
          en: 'Double shot ristretto espresso topped with velvety micro-foam steamed milk.',
        },
        price: '115.00',
        photoUrl: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=800&auto=format&fit=crop&q=80',
        sortOrder: 3,
      },
      {
        name: { tr: 'Cortado', en: 'Cortado' },
        description: {
          tr: 'Eşit oranda yoğun espresso ve ılık buharda ısıtılmış kadifemsi süt.',
          en: 'Equal parts rich espresso and lightly textured warm milk.',
        },
        price: '105.00',
        photoUrl: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=800&auto=format&fit=crop&q=80',
        sortOrder: 4,
      },
      {
        name: { tr: 'Latte', en: 'Caffè Latte' },
        description: {
          tr: 'Yumuşak içimli espresso, bol sıcak süt ve ince kremsi süt tabakası.',
          en: 'Smooth espresso combined with steamed milk and a delicate layer of foam.',
        },
        price: '110.00',
        photoUrl: 'https://images.unsplash.com/photo-1529892485617-25f63cd7b1e9?w=800&auto=format&fit=crop&q=80',
        sortOrder: 5,
      },
      {
        name: { tr: 'Cappuccino', en: 'Cappuccino' },
        description: {
          tr: 'Dengeli espresso lezzeti, eşit oranda süt ve yoğun ipeksi süt köpüğü.',
          en: 'Classic balance of rich espresso, steamed milk, and a thick cloud of silky milk froth.',
        },
        price: '110.00',
        photoUrl: 'https://images.unsplash.com/photo-1534432182912-63863115e106?w=800&auto=format&fit=crop&q=80',
        sortOrder: 6,
      },
    ],
  },
  {
    name: { tr: 'Soğuk Kahveler', en: 'Cold Coffees' },
    photoUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=800&auto=format&fit=crop&q=80',
    sortOrder: 2,
    products: [
      {
        name: { tr: 'Iced Spanish Latte', en: 'Iced Spanish Latte' },
        description: {
          tr: 'Duble espresso, soğuk süt ve tatlandırılmış yoğunlaştırılmış süt karışımı buzla.',
          en: 'Double espresso poured over ice with fresh milk and sweet condensed milk.',
        },
        price: '140.00',
        photoUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=800&auto=format&fit=crop&q=80',
        sortOrder: 1,
      },
      {
        name: { tr: 'Cold Brew (16 Saat Demleme)', en: 'Cold Brew 16hr' },
        description: {
          tr: '16 saat soğuk demleme tekniğiyle hazırlanmış düşük asiditeli pürüzsüz içim.',
          en: 'Smooth 16-hour cold steep specialty coffee over crystal ice.',
        },
        price: '125.00',
        photoUrl: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&auto=format&fit=crop&q=80',
        sortOrder: 2,
      },
      {
        name: { tr: 'Iced Americano', en: 'Iced Americano' },
        description: {
          tr: 'Duble shot taze espresso ve soğuk filtrelenmiş suyun buzla buluşması.',
          en: 'Double shot fresh espresso over crisp cold water and ice for a clean lift.',
        },
        price: '95.00',
        photoUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop&q=80',
        sortOrder: 3,
      },
      {
        name: { tr: 'Iced Salted Caramel Latte', en: 'Iced Salted Caramel Latte' },
        description: {
          tr: 'Ev yapımı deniz tuzlu karamel sosu, espresso, soğuk süt ve buz.',
          en: 'Artisanal sea salted caramel drizzle, espresso, chilled milk, and ice.',
        },
        price: '145.00',
        photoUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&auto=format&fit=crop&q=80',
        sortOrder: 4,
      },
      {
        name: { tr: 'Espresso Tonic', en: 'Espresso Tonic' },
        description: {
          tr: 'Premium botanik tonik, taze sıkılmış limon dilimi ve aromatik espresso shot.',
          en: 'Premium tonic water, a twist of citrus, topped with layered fresh espresso.',
        },
        price: '130.00',
        photoUrl: 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=800&auto=format&fit=crop&q=80',
        sortOrder: 5,
      },
    ],
  },
  {
    name: { tr: 'Fırından & Tatlılar', en: 'Pastries & Desserts' },
    photoUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80',
    sortOrder: 3,
    products: [
      {
        name: { tr: 'San Sebastian Cheesecake', en: 'San Sebastian Cheesecake' },
        description: {
          tr: 'İçi kremsi akışkan, üstü karamelize yanık klasik Bask cheesecake dilimi.',
          en: 'Creamy inside with a caramelized burnt Basque top crust.',
        },
        price: '160.00',
        photoUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&auto=format&fit=crop&q=80',
        sortOrder: 1,
      },
      {
        name: { tr: 'Taze Tereyağlı Kruvasan', en: 'Fresh Butter Croissant' },
        description: {
          tr: 'Her sabah günlük fırınlanan kat kat çıtır Fransız tereyağlı kruvasan.',
          en: 'Flaky daily baked French butter croissant with golden layers.',
        },
        price: '85.00',
        photoUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&auto=format&fit=crop&q=80',
        sortOrder: 2,
      },
      {
        name: { tr: 'Yaban Mersinli Danish', en: 'Blueberry Danish' },
        description: {
          tr: 'Taze yaban mersini dolgulu ve vanilya kremalı çıtır tereyağlı danish.',
          en: 'Flaky pastry topped with fresh blueberries and vanilla custard cream.',
        },
        price: '95.00',
        photoUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80',
        sortOrder: 3,
      },
      {
        name: { tr: 'Havuçlu Tarçınlı Kek', en: 'Carrot Cinnamon Cake' },
        description: {
          tr: 'Taze havuç rendesi, ceviz, Seylan tarçını ve nefis labne kreması dolgulu kek.',
          en: 'Moist spiced cake packed with fresh carrots, walnuts, and cream cheese frosting.',
        },
        price: '120.00',
        photoUrl: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=800&auto=format&fit=crop&q=80',
        sortOrder: 4,
      },
      {
        name: { tr: 'Belçika Çikolatalı Cookie', en: 'Belgian Chocolate Cookie' },
        description: {
          tr: 'İçi yumuşak Callebaut sütlü ve bitter çikolata parçacıklı dev kurabiye.',
          en: 'Giant soft-baked cookie loaded with premium Belgian chocolate chunks.',
        },
        price: '90.00',
        photoUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&auto=format&fit=crop&q=80',
        sortOrder: 5,
      },
      {
        name: { tr: 'Gluten-Free Brownie', en: 'Gluten-Free Brownie' },
        description: {
          tr: 'Glutensiz badem unu ve %70 bitter çikolatayla fırınlanmış yoğun nemli brownie.',
          en: 'Fudgy rich brownie baked with almond flour and 70% dark chocolate.',
        },
        price: '130.00',
        photoUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop&q=80',
        sortOrder: 6,
      },
    ],
  },
  {
    name: { tr: 'Çaylar & Özel İçecekler', en: 'Teas & Specialty Drinks' },
    photoUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80',
    sortOrder: 4,
    products: [
      {
        name: { tr: 'Iced Japanese Matcha Latte', en: 'Iced Japanese Matcha Latte' },
        description: {
          tr: 'Uji seremoniyel derece organik matcha ve organik yulaf sütü ile buzlu sunum.',
          en: 'Ceremonial grade Uji organic matcha whisked with oat milk over ice.',
        },
        price: '150.00',
        photoUrl: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=800&auto=format&fit=crop&q=80',
        sortOrder: 1,
      },
      {
        name: { tr: 'Demleme Hibiskus Çayı', en: 'Brewed Hibiscus Tea' },
        description: {
          tr: 'Taze nane yaprakları ve çubuk tarçın eşliğinde soğuk demlenmiş yakut rengi hibiskus.',
          en: 'Cold brewed ruby hibiscus tea served with fresh mint and cinnamon.',
        },
        price: '90.00',
        photoUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&auto=format&fit=crop&q=80',
        sortOrder: 2,
      },
      {
        name: { tr: 'Geleneksel Türk Çayı', en: 'Traditional Turkish Tea' },
        description: {
          tr: 'Rize seçkin yapraklarından taze demlenmiş berrak demiyle ince belli bardakta.',
          en: 'Freshly brewed premium black tea from Rize in a traditional curved glass.',
        },
        price: '40.00',
        photoUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80',
        sortOrder: 3,
      },
      {
        name: { tr: 'Chai Tea Latte', en: 'Chai Tea Latte' },
        description: {
          tr: 'Kakule, tarçın, zencefil baharat harmanı ve kadifemsi sıcak süt köpüğü.',
          en: 'Aromatic spiced black tea with cinnamon, cardamom, and steamed milk foam.',
        },
        price: '125.00',
        photoUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&auto=format&fit=crop&q=80',
        sortOrder: 4,
      },
      {
        name: { tr: 'Taze Sıkılmış Portakal Suyu', en: 'Freshly Squeezed Orange Juice' },
        description: {
          tr: 'Sipariş anında taze sıkılan Finike portakalları, %100 doğal ve katkısız.',
          en: 'Pure 100% freshly squeezed sweet Mediterranean orange juice.',
        },
        price: '95.00',
        photoUrl: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=800&auto=format&fit=crop&q=80',
        sortOrder: 5,
      },
    ],
  },
];

async function sync() {
  console.log(`Connecting to ${BACKEND_URL}...`);

  const loginRes = await fetch(`${BACKEND_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@kahveerenkoy.com', password: 'erenkoy123' }),
  });
  if (!loginRes.ok) {
    throw new Error(`Login failed with status ${loginRes.status}: ${await loginRes.text()}`);
  }
  const { access_token } = await loginRes.json();
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${access_token}`,
  };

  const getCatsRes = await fetch(`${BACKEND_URL}/admin/restaurants/kahve-erenkoy/categories`, {
    headers,
  });
  const existingCats = await getCatsRes.json();
  console.log(`Found ${existingCats.length} existing categories.`);

  for (const catData of categoriesData) {
    const existingCat = existingCats.find((c: any) => c.sortOrder === catData.sortOrder);
    let categoryId = '';

    if (existingCat) {
      console.log(`Updating category [${catData.sortOrder}]: ${catData.name.tr}`);
      const patchRes = await fetch(
        `${BACKEND_URL}/admin/restaurants/kahve-erenkoy/categories/${existingCat.id}`,
        {
          method: 'PATCH',
          headers,
          body: JSON.stringify({
            name: catData.name,
            sortOrder: catData.sortOrder,
          }),
        },
      );
      const updatedCat = await patchRes.json();
      categoryId = updatedCat.id;

      // Delete old products in this category to ensure clean state
      if (existingCat.products && existingCat.products.length > 0) {
        for (const p of existingCat.products) {
          await fetch(`${BACKEND_URL}/admin/categories/${categoryId}/products/${p.id}`, {
            method: 'DELETE',
            headers,
          });
        }
      }
    } else {
      console.log(`Creating category [${catData.sortOrder}]: ${catData.name.tr}`);
      const createRes = await fetch(`${BACKEND_URL}/admin/restaurants/kahve-erenkoy/categories`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: catData.name,
          sortOrder: catData.sortOrder,
        }),
      });
      const createdCat = await createRes.json();
      categoryId = createdCat.id;
    }

    // Create products
    for (const prodData of catData.products) {
      const prodRes = await fetch(`${BACKEND_URL}/admin/categories/${categoryId}/products`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: prodData.name,
          description: prodData.description,
          price: prodData.price,
          photoUrl: prodData.photoUrl,
          sortOrder: prodData.sortOrder,
        }),
      });
      if (!prodRes.ok) {
        console.error(`Failed to create product ${prodData.name.tr}:`, await prodRes.text());
      } else {
        const prod = await prodRes.json();
        console.log(`  ☕ [${prodData.sortOrder}] ${prodData.name.tr} — ₺${prod.price}`);
      }
    }
  }

  console.log('✅ Remote Kahve Erenkoy categories & products synced successfully!');
}

sync().catch((err) => {
  console.error('Sync failed:', err);
  process.exit(1);
});
