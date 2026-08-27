-- Add canViewAnalytics RBAC permission flag to RestaurantSettings
ALTER TABLE "RestaurantSettings" ADD COLUMN "canViewAnalytics" BOOLEAN NOT NULL DEFAULT true;
