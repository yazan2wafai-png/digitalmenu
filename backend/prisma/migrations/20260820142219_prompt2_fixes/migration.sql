-- AlterTable
ALTER TABLE "AdminUser" ALTER COLUMN "restaurantId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "options" JSONB;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "options" JSONB;
