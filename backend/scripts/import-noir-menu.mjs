// Imports the real ACT NOIR menu (from the physical menu board photo)
// into act-noir-cafe: 5 categories, ~24 products. No "Süt Tercihleri"
// add-ons (+30 for oat/almond/lactose-free milk) - the product model
// has no add-on/modifier concept yet, so those are left out on purpose.
//
// Usage:
//   cd backend
//   node scripts/import-noir-menu.mjs
//
// If login fails, first run: railway run node scripts/reset-noir-password.mjs

const API_URL = 'https://digitalmenu-backend-production.up.railway.app';
const SLUG = 'act-noir-cafe';
const EMAIL = process.env.NOIR_EMAIL || 'admin@actnoircafe.com';
const PASSWORD = process.env.NOIR_PASSWORD || 'noir123';

const MENU = [
  {
    name: { tr: 'Kahveler', en: 'Coffees' },
    products: [
      { name: { tr: 'Espresso', en: 'Espresso' }, price: '190.00' },
      { name: { tr: 'Americano', en: 'Americano' }, price: '225.00' },
      { name: { tr: 'Filtre Kahve', en: 'Filter Coffee' }, price: '225.00' },
      { name: { tr: 'Latte', en: 'Latte' }, price: '240.00' },
      { name: { tr: 'Cappuccino', en: 'Cappuccino' }, price: '240.00' },
      { name: { tr: 'Cortado', en: 'Cortado' }, price: '245.00' },
      { name: { tr: 'Flat White', en: 'Flat White' }, price: '240.00' },
      { name: { tr: 'Mocha B/W', en: 'Mocha B/W' }, price: '265.00' },
      { name: { tr: 'Türk Kahvesi', en: 'Turkish Coffee' }, price: '160.00' },
      { name: { tr: 'Matcha', en: 'Matcha' }, price: '260.00' },
    ],
  },
  {
    name: { tr: 'Soğuk Kahveler', en: 'Cold Coffees' },
    products: [
      { name: { tr: 'Ice Americano', en: 'Ice Americano' }, price: '230.00' },
      { name: { tr: 'Ice Latte', en: 'Ice Latte' }, price: '250.00' },
      { name: { tr: 'Ice Mocha B/W', en: 'Ice Mocha B/W' }, price: '275.00' },
    ],
  },
  {
    name: { tr: 'Soğuk Çaylar', en: 'Cold Teas' },
    products: [
      { name: { tr: 'Kuzu Kulağı & Erik', en: 'Sorrel & Plum' }, price: '290.00' },
      { name: { tr: 'Strawberry Hibiskus', en: 'Strawberry Hibiscus' }, price: '290.00' },
      { name: { tr: 'Cool Lime', en: 'Cool Lime' }, price: '290.00' },
      { name: { tr: 'White Peach', en: 'White Peach' }, price: '290.00' },
    ],
  },
  {
    name: { tr: 'Sıcak Çaylar', en: 'Hot Teas' },
    products: [
      { name: { tr: 'Çay', en: 'Tea' }, price: '120.00' },
      { name: { tr: 'Yaseminli Yeşil Çay', en: 'Jasmine Green Tea' }, price: '200.00' },
      { name: { tr: 'Rooibos Vanilya', en: 'Rooibos Vanilla' }, price: '200.00' },
      { name: { tr: 'Kavunlu Beyaz Çay', en: 'Melon White Tea' }, price: '200.00' },
      { name: { tr: 'Detox Tea', en: 'Detox Tea' }, price: '200.00' },
    ],
  },
  {
    name: { tr: 'Soft', en: 'Soft Drinks' },
    products: [
      { name: { tr: 'Su', en: 'Water' }, price: '50.00' },
      { name: { tr: 'Soda', en: 'Soda' }, price: '100.00' },
    ],
  },
];

async function main() {
  console.log(`Logging in as ${EMAIL}...`);
  const loginRes = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });

  if (!loginRes.ok) {
    const body = await loginRes.text();
    throw new Error(`Login failed (${loginRes.status}): ${body}`);
  }

  const { access_token, restaurantSlug } = await loginRes.json();
  console.log(`Logged in. Token restaurant slug: ${restaurantSlug}`);

  if (restaurantSlug !== SLUG) {
    throw new Error(
      `Logged-in account is scoped to "${restaurantSlug}", not "${SLUG}". Aborting to avoid writing to the wrong tenant.`,
    );
  }

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${access_token}`,
  };

  let categoryIndex = 0;
  for (const cat of MENU) {
    const catRes = await fetch(`${API_URL}/admin/restaurants/${SLUG}/categories`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ name: cat.name, sortOrder: categoryIndex }),
    });
    categoryIndex += 1;

    if (!catRes.ok) {
      const body = await catRes.text();
      console.error(`✗ Failed to create category "${cat.name.tr}" (${catRes.status}): ${body}`);
      continue;
    }

    const createdCat = await catRes.json();
    console.log(`✓ Category "${cat.name.tr}" / "${cat.name.en}" (id: ${createdCat.id})`);

    let productIndex = 0;
    for (const prod of cat.products) {
      const prodRes = await fetch(`${API_URL}/admin/categories/${createdCat.id}/products`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ ...prod, sortOrder: productIndex }),
      });
      productIndex += 1;

      if (!prodRes.ok) {
        const body = await prodRes.text();
        console.error(`  ✗ Failed "${prod.name.tr}" (${prodRes.status}): ${body}`);
        continue;
      }

      console.log(`  ✓ ${prod.name.tr} — ${prod.price} TL`);
    }
  }

  console.log('Done.');
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
