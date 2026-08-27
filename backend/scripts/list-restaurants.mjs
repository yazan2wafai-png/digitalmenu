// Quick diagnostic: lists every restaurant slug in whatever DB
// `railway run` currently points at, so we can see if this matches
// production or a different environment/service.
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('DATABASE_URL host:', (process.env.DATABASE_URL || '').replace(/:\/\/[^@]+@/, '://***@'));
  const restaurants = await prisma.restaurant.findMany({
    select: { slug: true, name: true, isActive: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });
  console.log(`Found ${restaurants.length} restaurant(s):`);
  for (const r of restaurants) {
    console.log(`  - slug="${r.slug}" name=${JSON.stringify(r.name)} active=${r.isActive}`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
