// Looks up the admin account(s) tied to act-noir-cafe and resets the
// password to a known value so we can log in via the API and finish
// setting up the menu. Run this against production via Railway CLI
// (it needs a real DATABASE_URL - Railway injects it for you).
//
// Usage:
//   cd backend
//   railway run node scripts/reset-noir-password.mjs

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const SLUG = 'act-noir-cafe';
const NEW_PASSWORD = 'noir123';

async function main() {
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug: SLUG },
  });

  if (!restaurant) {
    console.error(`No restaurant found with slug "${SLUG}".`);
    process.exit(1);
  }

  console.log(`Restaurant: ${restaurant.slug} (id: ${restaurant.id})`);

  const admins = await prisma.adminUser.findMany({
    where: { restaurantId: restaurant.id },
  });

  if (admins.length === 0) {
    console.log('No AdminUser is linked to this restaurant. Creating one...');
    const passwordHash = await bcrypt.hash(NEW_PASSWORD, 10);
    const created = await prisma.adminUser.create({
      data: {
        restaurantId: restaurant.id,
        email: 'admin@actnoircafe.com',
        passwordHash,
        role: 'RESTAURANT_ADMIN',
      },
    });
    console.log(`Created admin user: ${created.email} / password: ${NEW_PASSWORD}`);
    return;
  }

  console.log(`Found ${admins.length} admin user(s) linked to this restaurant:`);
  for (const admin of admins) {
    console.log(`  - ${admin.email} (role: ${admin.role})`);
  }

  const passwordHash = await bcrypt.hash(NEW_PASSWORD, 10);
  for (const admin of admins) {
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { passwordHash },
    });
    console.log(`Reset password for ${admin.email} -> "${NEW_PASSWORD}"`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
