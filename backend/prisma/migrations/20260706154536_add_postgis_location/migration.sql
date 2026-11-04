-- CreateExtension
CREATE EXTENSION IF NOT EXISTS postgis;

-- AlterTable
ALTER TABLE "locations" ADD COLUMN     "districtId" TEXT,
ADD COLUMN     "location" geography(Point, 4326),
ADD COLUMN     "provinceId" TEXT,
ADD COLUMN     "wardId" TEXT;

-- CreateIndex
CREATE INDEX IF NOT EXISTS idx_locations_location ON "locations" USING GIST ("location");
CREATE INDEX IF NOT EXISTS idx_locations_province_id ON "locations"("provinceId");
CREATE INDEX IF NOT EXISTS idx_locations_district_id ON "locations"("districtId");
