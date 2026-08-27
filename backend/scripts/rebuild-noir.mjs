// Rebuilds the Act Noir tenant from scratch: deletes the existing
// act-noir-cafe restaurant (its login was lost / unrecoverable, and it
// had zero categories/products anyway - nothing to lose), recreates it
// with a known admin login, sets its theme color close to the real
// ACT NOIR brand (pink, sampled from the physical menu board photo),
// then imports the full menu from that board.
//
// Needs SUPER_ADMIN credentials - pass them as env vars so they never
// end up hardcoded in a committed file:
//
//   SUPER_ADMIN_EMAIL=... SUPER_ADMIN_PASSWORD=... node scripts/rebuild-noir.mjs

const API_URL = 'https://digitalmenu-backend-production.up.railway.app';
const SLUG = 'act-noir-cafe';
const NEW_ADMIN_EMAIL = 'admin@actnoircafe.com';
const NEW_ADMIN_PASSWORD = 'noir123';
const THEME_COLOR = '#D6608E'; // sampled from the ACT NOIR menu board photo

const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL;
const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD;

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

async function jsonOrThrow(res, label) {
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${label} failed (${res.status}): ${body}`);
  }
  return res.json();
}

async function main() {
  if (!SUPER_ADMIN_EMAIL || !SUPER_ADMIN_PASSWORD) {
    throw new Error(
      'Set SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD env vars before running this script.',
    );
  }

  console.log('Logging in as super admin...');
  const superLogin = await jsonOrThrow(
    await fetch(`${API_URL}/super-admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: SUPER_ADMIN_EMAIL, password: SUPER_ADMIN_PASSWORD }),
    }),
    'Super admin login',
  );
  const superToken = superLogin.accessToken;
  const superHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${superToken}`,
  };
  console.log('Super admin logged in.');

  console.log(`Deleting existing restaurant "${SLUG}" (if it exists)...`);
  const delRes = await fetch(`${API_URL}/super-admin/restaurants/${SLUG}`, {
    method: 'DELETE',
    headers: superHeaders,
  });
  if (delRes.ok) {
    console.log('  ✓ Deleted old restaurant.');
  } else if (delRes.status === 404) {
    console.log('  (nothing to delete, slug was free)');
  } else {
    const body = await delRes.text();
    throw new Error(`Delete failed (${delRes.status}): ${body}`);
  }

  console.log(`Creating fresh restaurant "${SLUG}"...`);
  const created = await jsonOrThrow(
    await fetch(`${API_URL}/super-admin/restaurants`, {
      method: 'POST',
      headers: superHeaders,
      body: JSON.stringify({
        name: { tr: 'Act Noir', en: 'Act Noir' },
        slug: SLUG,
        themeColor: THEME_COLOR,
        supportedLocales: ['tr', 'en'],
        defaultLocale: 'tr',
        adminEmail: NEW_ADMIN_EMAIL,
        adminPassword: NEW_ADMIN_PASSWORD,
      }),
    }),
    'Create restaurant',
  );
  console.log(`  ✓ Created. Admin login: ${NEW_ADMIN_EMAIL} / ${NEW_ADMIN_PASSWORD}`);
  console.log(JSON.stringify(created, null, 2));

  console.log('Logging in as the new tenant admin to import the menu...');
  const tenantLogin = await jsonOrThrow(
    await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: NEW_ADMIN_EMAIL, password: NEW_ADMIN_PASSWORD }),
    }),
    'Tenant admin login',
  );
  const tenantHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${tenantLogin.access_token}`,
  };

  let categoryIndex = 0;
  for (const cat of MENU) {
    const createdCat = await jsonOrThrow(
      await fetch(`${API_URL}/admin/restaurants/${SLUG}/categories`, {
        method: 'POST',
        headers: tenantHeaders,
        body: JSON.stringify({ name: cat.name, sortOrder: categoryIndex }),
      }),
      `Create category "${cat.name.tr}"`,
    );
    categoryIndex += 1;
    console.log(`✓ Category "${cat.name.tr}" / "${cat.name.en}" (id: ${createdCat.id})`);

    let productIndex = 0;
    for (const prod of cat.products) {
      const prodRes = await fetch(`${API_URL}/admin/categories/${createdCat.id}/products`, {
        method: 'POST',
        headers: tenantHeaders,
        body: JSON.stringify({ ...prod, sortOrder: productIndex }),
      });
      productIndex += 1;
      if (!prodRes.ok) {
        console.error(`  ✗ Failed "${prod.name.tr}" (${prodRes.status}): ${await prodRes.text()}`);
        continue;
      }
      console.log(`  ✓ ${prod.name.tr} — ${prod.price} TL`);
    }
  }

  console.log('\nDone. Act Noir is rebuilt with the real menu.');
  console.log(`Login: ${API_URL === API_URL ? 'https://admin.nfcmyplace.com/admin/login?slug=' + SLUG : ''}`);
  console.log(`  ${NEW_ADMIN_EMAIL} / ${NEW_ADMIN_PASSWORD}`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
