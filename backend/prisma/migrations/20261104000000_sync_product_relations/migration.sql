-- Complete the many-to-many model used by the API and preserve existing category links.
BEGIN;
ALTER TABLE "categories" ADD COLUMN "formSchema" JSONB;
ALTER TABLE "products" ADD COLUMN "attributes" JSONB;

CREATE TABLE "tags" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");
CREATE INDEX "tags_name_idx" ON "tags"("name");

CREATE TABLE "_CategoryToProduct" (
  "A" TEXT NOT NULL,
  "B" TEXT NOT NULL,
  CONSTRAINT "_CategoryToProduct_AB_pkey" PRIMARY KEY ("A", "B")
);
CREATE INDEX "_CategoryToProduct_B_index" ON "_CategoryToProduct"("B");
ALTER TABLE "_CategoryToProduct" ADD CONSTRAINT "_CategoryToProduct_A_fkey"
  FOREIGN KEY ("A") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_CategoryToProduct" ADD CONSTRAINT "_CategoryToProduct_B_fkey"
  FOREIGN KEY ("B") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO "_CategoryToProduct" ("A", "B")
  SELECT "categoryId", "id" FROM "products";
ALTER TABLE "products" DROP CONSTRAINT "products_categoryId_fkey";
DROP INDEX "products_categoryId_idx";
ALTER TABLE "products" DROP COLUMN "categoryId";

CREATE TABLE "_ProductToTag" (
  "A" TEXT NOT NULL,
  "B" TEXT NOT NULL,
  CONSTRAINT "_ProductToTag_AB_pkey" PRIMARY KEY ("A", "B")
);
CREATE INDEX "_ProductToTag_B_index" ON "_ProductToTag"("B");
ALTER TABLE "_ProductToTag" ADD CONSTRAINT "_ProductToTag_A_fkey"
  FOREIGN KEY ("A") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_ProductToTag" ADD CONSTRAINT "_ProductToTag_B_fkey"
  FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- The earlier sync_client migration removed these indexes; restore them.
CREATE INDEX IF NOT EXISTS idx_locations_location ON "locations" USING GIST ("location");
CREATE INDEX IF NOT EXISTS idx_locations_province_id ON "locations"("provinceId");
CREATE INDEX IF NOT EXISTS idx_locations_district_id ON "locations"("districtId");
COMMIT;
