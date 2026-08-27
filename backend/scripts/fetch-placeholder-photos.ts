/**
 * ⚠️ ONE-TIME TRIAL-DATA / DEMO SCRIPT ONLY
 * =========================================
 * This script is intended strictly for local development, seeding, and demo purposes.
 * DO NOT USE THIS SCRIPT IN PRODUCTION.
 *
 * Functionality:
 * 1. Reads PEXELS_API_KEY from environment or .env file.
 * 2. Fetches all products from the database.
 * 3. Searches Pexels for relevant, free commercial-safe food photos.
 * 4. Downloads each photo into backend/uploads/ and updates Product.photoUrl in PostgreSQL.
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load .env file
dotenv.config();

const prisma = new PrismaClient();

const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';
const PEXELS_API_KEY = process.env.PEXELS_API_KEY || '';

// Map product names to optimal Pexels search keywords
const SEARCH_KEYWORD_MAP: Record<string, string> = {
  'Classic Baltazar': 'gourmet burger',
  'Klasik Baltazar': 'gourmet burger',
  'Karaköy Smash': 'smash burger',
  'BBQ Smoke': 'bbq bacon burger',
  'Chicken Baltazar': 'crispy chicken burger',
  'Tavuk Baltazar': 'crispy chicken burger',
  'Mushroom & Truffle': 'mushroom burger',
  'Mantar & Trüf': 'mushroom burger',
  'French Fries': 'french fries',
  'Amerikan Patates': 'french fries',
  'Onion Rings': 'onion rings',
  'Soğan Halkası': 'onion rings',
  'Mozzarella Sticks': 'mozzarella sticks',
  'Mozzarella Çubukları': 'mozzarella sticks',
  'Classic Milkshake': 'chocolate milkshake',
  'Klasik Milkshake': 'chocolate milkshake',
  'Lemonade': 'fresh lemonade',
  'Limonata': 'fresh lemonade',
  'Cold Brew Coffee': 'cold brew coffee',
  'Soğuk Brew Kahve': 'cold brew coffee',
  'Warm Brownie': 'chocolate brownie ice cream',
  'Brownie Sıcak': 'chocolate brownie ice cream',
  'Cheesecake Slice': 'cheesecake',
  'Cheesecake Dilimi': 'cheesecake',
};

import type { Prisma } from '@prisma/client';

interface PexelsPhotoSrc {
  landscape?: string;
  medium?: string;
  original?: string;
}

interface PexelsPhoto {
  src: PexelsPhotoSrc;
}

interface PexelsApiResponse {
  photos?: PexelsPhoto[];
}

function getSearchKeyword(productNameJson: Prisma.JsonValue): string {
  if (!productNameJson) return 'food';
  const nameMap = (typeof productNameJson === 'object' && !Array.isArray(productNameJson)) ? (productNameJson as Record<string, string>) : null;
  const nameEn = nameMap?.en ?? (typeof productNameJson === 'string' ? productNameJson : '');
  const nameTr = nameMap?.tr ?? (typeof productNameJson === 'string' ? productNameJson : '');

  if (nameEn && SEARCH_KEYWORD_MAP[nameEn]) return SEARCH_KEYWORD_MAP[nameEn];
  if (nameTr && SEARCH_KEYWORD_MAP[nameTr]) return SEARCH_KEYWORD_MAP[nameTr];

  return nameEn || nameTr || 'food';
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
    const data = (await res.json()) as PexelsApiResponse;
    if (data.photos && data.photos.length > 0) {
      // Return medium or landscape size photo
      const src = data.photos[0].src;
      return src.medium ?? src.landscape ?? src.original ?? null;
    }
  } catch (err) {
    console.error(`  ❌ Failed to fetch photo from Pexels for "${query}":`, err);
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
  console.log('🖼️  [DEMO/TRIAL SCRIPT] Starting Pexels Photo Auto-Population...');
  
  if (!PEXELS_API_KEY) {
    console.warn('\n⚠️ WARNING: PEXELS_API_KEY is not defined in backend/.env');
    console.warn('  To fetch real Pexels photos, add: PEXELS_API_KEY="your_api_key" to backend/.env\n');
  }

  // Ensure uploads directory exists
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }

  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { sortOrder: 'asc' },
  });

  console.log(`📦 Found ${products.length} products in database.`);

  let updatedCount = 0;
  let fallbackCount = 0;

  for (const product of products) {
    const searchKeyword = getSearchKeyword(product.name);
    const prodMap = typeof product.name === 'object' && product.name !== null && !Array.isArray(product.name)
      ? (product.name as Record<string, string>)
      : null;
    const prodNameStr = prodMap?.en ?? prodMap?.tr ?? String(product.name);

    console.log(`\n🔍 Product: "${prodNameStr}" (Query: "${searchKeyword}")`);

    const pexelsPhotoUrl = await fetchPexelsPhotoUrl(searchKeyword, PEXELS_API_KEY);

    if (pexelsPhotoUrl) {
      const filename = `pexels-${product.id}.jpg`;
      const destPath = path.join(UPLOADS_DIR, filename);

      console.log(`  📥 Downloading photo from Pexels...`);
      const downloaded = await downloadImage(pexelsPhotoUrl, destPath);

      if (downloaded) {
        const localPublicUrl = `${BASE_URL}/uploads/${filename}`;
        await prisma.product.update({
          where: { id: product.id },
          data: { photoUrl: localPublicUrl },
        });
        console.log(`  ✅ Updated in DB: ${localPublicUrl}`);
        updatedCount++;
      } else {
        console.log(`  ⚠️ Download failed, keeping original photoUrl: ${product.photoUrl}`);
        fallbackCount++;
      }
    } else {
      console.log(`  ℹ️ No Pexels photo fetched (or key missing), keeping original photoUrl: ${product.photoUrl}`);
      fallbackCount++;
    }
  }

  console.log('\n==================================================');
  console.log(`🎉 Script finished!`);
  console.log(`   - Updated with Pexels real photo : ${updatedCount}/${products.length}`);
  console.log(`   - Fell back to original placeholder : ${fallbackCount}/${products.length}`);
  console.log('==================================================\n');
}

main()
  .catch((e) => {
    console.error('Fatal error running fetch-placeholder-photos script:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
