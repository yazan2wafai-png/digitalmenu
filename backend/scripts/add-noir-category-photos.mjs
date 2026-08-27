// Adds category cover photos to Act Noir - fixes the empty/flat category
// tiles on the menu grid. Reuses Unsplash photo IDs already live in
// production for Kahve Erenköy / Baltazar (verified working, thematically
// matched), so there's no risk of a broken image on a guess.
//
// Usage:
//   cd backend
//   node scripts/add-noir-category-photos.mjs

const API_URL = 'https://digitalmenu-backend-production.up.railway.app';
const SLUG = 'act-noir-cafe';
const EMAIL = 'admin@actnoircafe.com';
const PASSWORD = 'noir123';

const CATEGORY_PHOTOS = {
  Kahveler: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=80',
  'Soğuk Kahveler': 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=800&auto=format&fit=crop&q=80',
  'Soğuk Çaylar': 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&auto=format&fit=crop&q=80',
  'Sıcak Çaylar': 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80',
  Soft: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop&q=80',
};

async function jsonOrThrow(res, label) {
  if (!res.ok) throw new Error(`${label} failed (${res.status}): ${await res.text()}`);
  return res.json();
}

async function main() {
  const login = await jsonOrThrow(
    await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
    }),
    'Login',
  );
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${login.access_token}`,
  };

  const categories = await jsonOrThrow(
    await fetch(`${API_URL}/admin/restaurants/${SLUG}/categories`, { headers }),
    'List categories',
  );

  for (const cat of categories) {
    const photoUrl = CATEGORY_PHOTOS[cat.name?.tr];
    if (!photoUrl) {
      console.log(`(no photo mapped for "${cat.name?.tr}", skipping)`);
      continue;
    }
    const res = await fetch(`${API_URL}/admin/restaurants/${SLUG}/categories/${cat.id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ photoUrl }),
    });
    if (!res.ok) {
      console.error(`✗ ${cat.name?.tr} (${res.status}): ${await res.text()}`);
      continue;
    }
    console.log(`✓ ${cat.name?.tr} -> photo set`);
  }

  console.log('Done.');
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
