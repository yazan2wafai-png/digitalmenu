// Uploads the real ACT NOIR logo (cropped from the physical menu board
// photo, saved at scripts/assets/act-noir-logo.png) and sets it as the
// restaurant's logoUrl, plus re-confirms the brand pink themeColor.
//
// Needs the PATCH /admin/me/restaurant/profile endpoint - only exists
// after the latest backend deploy goes out. If this 404s, the backend
// hasn't picked up the new code yet.
//
// Usage:
//   cd backend
//   node scripts/set-noir-logo.mjs

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const API_URL = 'https://digitalmenu-backend-production.up.railway.app';
const SLUG = 'act-noir-cafe';
const EMAIL = 'admin@actnoircafe.com';
const PASSWORD = 'noir123';
const LOGO_PATH = path.join(__dirname, 'assets', 'act-noir-logo.png');
const THEME_COLOR = '#D6608E';

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
  const authHeader = { Authorization: `Bearer ${login.access_token}` };

  console.log('Uploading logo image...');
  const fileBuffer = await readFile(LOGO_PATH);
  const form = new FormData();
  form.append('file', new Blob([fileBuffer], { type: 'image/png' }), 'act-noir-logo.png');

  const uploadRes = await fetch(`${API_URL}/upload/image`, {
    method: 'POST',
    headers: authHeader,
    body: form,
  });
  const { url: logoUrl } = await jsonOrThrow(uploadRes, 'Upload logo');
  console.log(`✓ Uploaded: ${logoUrl}`);

  console.log('Updating restaurant profile...');
  const profileRes = await fetch(`${API_URL}/admin/me/restaurant/profile`, {
    method: 'PATCH',
    headers: { ...authHeader, 'Content-Type': 'application/json' },
    body: JSON.stringify({ logoUrl, themeColor: THEME_COLOR }),
  });
  await jsonOrThrow(profileRes, 'Update profile');
  console.log('✓ Profile updated with logo + theme color.');
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
