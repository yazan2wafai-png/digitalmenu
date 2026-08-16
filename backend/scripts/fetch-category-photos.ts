/**
 * ⚠️ ONE-TIME TRIAL-DATA / DEMO SCRIPT ONLY
 * =========================================
 * This script is intended strictly for local development, seeding, and demo purposes.
 * DO NOT USE THIS SCRIPT IN PRODUCTION.
 *
 * Functionality:
 * 1. Reads PEXELS_API_KEY from environment or backend/.env file.
 * 2. Fetches all categories from PostgreSQL database via Prisma.
 * 3. Searches Pexels for ONE high-quality category background photo per category.
 * 4. Downloads each photo into backend/uploads/ and updates Category.photoUrl in PostgreSQL.
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';
const PEXELS_API_KEY = process.env.PEXELS_API_KEY || '';

// Map category names to optimal Pexels search queries
const CATEGORY_SEARCH_MAP: Record<string, string> = {
  Burgers: 'burgers',
  Burgerler: 'burgers',
  Sides: 'french fries snacks',
  Atıştırmalıklar: 'french fries snacks',
  Drinks: 'milkshake drinks',
  İçecekler: 'milkshake drinks',
  Desserts: 'desserts bakery',
  Tatlılar: 'desserts bakery',
};

function getCategoryQuery(catNameJson: any): string {
  if (!catNameJson) return 'restaurant food';
  const nameEn = typeof catNameJson === 'object' ? catNameJson.en : String(catNameJson);
  const nameTr = typeof catNameJson === 'object' ? catNameJson.tr : String(catNameJson);

  if (nameEn && CATEGORY_SEARCH_MAP[nameEn]) return CATEGORY_SEARCH_MAP[nameEn];
  if (nameTr && CATEGORY_SEARCH_MAP[nameTr]) return CATEGORY_SEARCH_MAP[nameTr];

  return nameEn || nameTr || 'restaurant food';
}

async function fetchPexelsPhotoUrl(query: string, apiKey: string): Promise<string | null> {
  if (!apiKey) return null;
  try {
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`;
    const res = await fetch(url, {
      headers: { Authorization: apiKey },
    });
    if (!res.ok) {
      console.warn(`  ⚠️ Pexels API returned status ${res.status} for query "${query}"`);
      return null;
    }
    const data = (await res.json()) as any;
    if (data.photos && data.photos.length > 0) {
      return data.photos[0].src.landscape || data.photos[0].src.medium || data.photos[0].src.original;
    }
  } catch (err) {
    console.error(`  ❌ Failed to fetch category photo from Pexels for "${query}":`, err);
  }
  return null;
}

async function downloadImage(imageUrl: string, destPath: string): Promise<boolean> {
  try {
    const res = await fetch(imageUrl);
    if (!res.ok) return false;
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(destPath, buffer);
    return true;
  } catch (err) {
    console.error(`  ❌ Failed to download image from ${imageUrl}:`, err);
    return false;
  }
}

async function main() {
  console.log('🖼️  [DEMO/TRIAL SCRIPT] Starting Pexels Category Photo Auto-Population...');

  if (!PEXELS_API_KEY) {
    console.warn('\n⚠️ WARNING: PEXELS_API_KEY is not defined in backend/.env');
    console.warn('  To fetch real Pexels category photos, add: PEXELS_API_KEY="your_api_key" to backend/.env\n');
  }

  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }

  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: 'asc' },
  });

  console.log(`📂 Found ${categories.length} categories in database.`);

  let updatedCount = 0;
  let fallbackCount = 0;

  for (const cat of categories) {
    const query = getCategoryQuery(cat.name);
    const catNameStr = typeof cat.name === 'object' && cat.name !== null
      ? (cat.name as any).en || (cat.name as any).tr
      : String(cat.name);

    console.log(`\n📂 Category: "${catNameStr}" (Query: "${query}")`);

    const pexelsPhotoUrl = await fetchPexelsPhotoUrl(query, PEXELS_API_KEY);

    if (pexelsPhotoUrl) {
      const filename = `pexels-cat-${cat.id}.jpg`;
      const destPath = path.join(UPLOADS_DIR, filename);

      console.log(`  📥 Downloading category photo...`);
      const downloaded = await downloadImage(pexelsPhotoUrl, destPath);

      if (downloaded) {
        const localPublicUrl = `${BASE_URL}/uploads/${filename}`;
        await prisma.category.update({
          where: { id: cat.id },
          data: { photoUrl: localPublicUrl },
        });
        console.log(`  ✅ Updated Category in DB: ${localPublicUrl}`);
        updatedCount++;
      } else {
        console.log(`  ⚠️ Download failed for category: ${catNameStr}`);
        fallbackCount++;
      }
    } else {
      console.log(`  ℹ️ No photo fetched (or key missing), category photoUrl remains: ${cat.photoUrl || 'null'}`);
      fallbackCount++;
    }
  }

  console.log('\n==================================================');
  console.log(`🎉 Category script finished!`);
  console.log(`   - Updated with Pexels real photo : ${updatedCount}/${categories.length}`);
  console.log(`   - Fell back / null               : ${fallbackCount}/${categories.length}`);
  console.log('==================================================\n');
}

main()
  .catch((e) => {
    console.error('Fatal error running fetch-category-photos script:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
