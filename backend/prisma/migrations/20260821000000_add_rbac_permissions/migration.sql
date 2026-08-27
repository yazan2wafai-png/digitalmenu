-- Backfill: these RBAC permission columns were added to schema.prisma in an earlier
-- commit (2a6a516) but no migration file was ever generated for them (likely applied
-- locally via `prisma db push` instead of `migrate dev`), so production never got them.
ALTER TABLE "RestaurantSettings" ADD COLUMN IF NOT EXISTS "canViewOrders" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "RestaurantSettings" ADD COLUMN IF NOT EXISTS "canTrackTables" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "RestaurantSettings" ADD COLUMN IF NOT EXISTS "canManageMenu" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "RestaurantSettings" ADD COLUMN IF NOT EXISTS "canManageStaff" BOOLEAN NOT NULL DEFAULT true;
