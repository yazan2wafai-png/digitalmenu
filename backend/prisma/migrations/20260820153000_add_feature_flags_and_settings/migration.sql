-- AlterTable: Add feature flags to RestaurantSettings
ALTER TABLE "RestaurantSettings" ADD COLUMN IF NOT EXISTS "enableOrdering" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "RestaurantSettings" ADD COLUMN IF NOT EXISTS "enableTables" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "RestaurantSettings" ADD COLUMN IF NOT EXISTS "enableAnalytics" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "RestaurantSettings" ADD COLUMN IF NOT EXISTS "enableMultiLanguage" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "RestaurantSettings" ADD COLUMN IF NOT EXISTS "enableReviews" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "RestaurantSettings" ADD COLUMN IF NOT EXISTS "enableServiceCall" BOOLEAN NOT NULL DEFAULT false;
