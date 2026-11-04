import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';
import {
  buildProductSeedData,
  CURATED_PRODUCTS,
  LEGACY_CURATED_TITLES,
  type ProductSeedData,
} from './product-data';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

interface RepairTarget {
  id: string;
  currentTitle: string;
  expected: ProductSeedData;
}

const SAMPLE_MESSAGE_REWRITES = [
  {
    from: 'Chào anh Minh, chiếc iPhone 14 Pro Max còn fix thêm chút lộc lá nào không ạ?',
    to: 'Chào anh Minh, chiếc iPhone Pro 256GB còn fix thêm chút lộc lá nào không ạ?',
  },
  {
    from: 'Chị Vân ơi, bàn phím cơ Keychron K2 này có sẵn đầu thu USB không ạ?',
    to: 'Chị Vân ơi, bàn phím cơ compact này có sẵn đầu thu USB không ạ?',
  },
  {
    from: 'Dòng K2 này dùng kết nối Bluetooth không dây hoặc cắm cáp Type-C trực tiếp em nha, không dùng cổng USB 2.4Ghz đâu.',
    to: 'Bàn phím này dùng kết nối Bluetooth hoặc cắm cáp Type-C trực tiếp em nha, không dùng đầu thu USB 2.4 GHz.',
  },
] as const;

const LEGACY_EXCHANGE_MESSAGE =
  'Chào bạn, mình muốn đổi chiếc xe đạp địa hình Giant lấy bàn phím cơ Keychron của bạn được không? Mình có thể bù thêm chút tiền nếu cần.';
const REPAIRED_EXCHANGE_MESSAGE =
  'Chào bạn, mình muốn đổi chiếc xe đạp fixed gear lấy bàn phím cơ compact của bạn được không? Mình có thể bù thêm chút tiền nếu cần.';

function resolveExpectedProduct(
  currentTitle: string,
  generatedProducts: readonly ProductSeedData[],
  curatedByTitle: ReadonlyMap<string, ProductSeedData>,
) {
  const curated = curatedByTitle.get(currentTitle);
  if (curated) return curated;

  const generatedNumber = currentTitle.match(/#0*(\d{1,3})$/)?.[1];
  if (!generatedNumber) return undefined;

  const generatedIndex = Number(generatedNumber) - 1;
  return generatedProducts[generatedIndex];
}

async function main() {
  const shouldApply = process.argv.includes('--apply');
  const expectedProducts = buildProductSeedData();
  const generatedProducts = expectedProducts.slice(CURATED_PRODUCTS.length);
  const curatedByTitle = new Map<string, ProductSeedData>();

  CURATED_PRODUCTS.forEach((product, index) => {
    curatedByTitle.set(product.title, product);
    curatedByTitle.set(LEGACY_CURATED_TITLES[index], product);
  });

  const [databaseProducts, categories] = await Promise.all([
    prisma.product.findMany({
      select: { id: true, title: true },
    }),
    prisma.category.findMany({
      select: { id: true, slug: true },
    }),
  ]);
  const categoryIdBySlug = new Map(
    categories.map((category) => [category.slug, category.id]),
  );
  const repairTargets: RepairTarget[] = [];
  const ignoredTitles: string[] = [];

  for (const product of databaseProducts) {
    const expected = resolveExpectedProduct(
      product.title,
      generatedProducts,
      curatedByTitle,
    );

    if (!expected) {
      ignoredTitles.push(product.title);
      continue;
    }

    if (!categoryIdBySlug.has(expected.categorySlug)) {
      throw new Error(
        `Missing category "${expected.categorySlug}" in database.`,
      );
    }

    repairTargets.push({
      id: product.id,
      currentTitle: product.title,
      expected,
    });
  }

  if (repairTargets.length !== expectedProducts.length) {
    throw new Error(
      `Matched ${repairTargets.length}/${expectedProducts.length} seeded products. ` +
        'No changes were made because the current database does not match the expected seed dataset.',
    );
  }

  const uniqueExpectedTitles = new Set(
    repairTargets.map((target) => target.expected.title),
  );
  if (uniqueExpectedTitles.size !== repairTargets.length) {
    throw new Error('Repair plan contains duplicate expected product titles.');
  }

  console.log(
    `Prepared ${repairTargets.length} product repairs; ${ignoredTitles.length} non-seed products will be preserved.`,
  );

  if (!shouldApply) {
    console.log('Dry run only. Re-run with --apply to update the database.');
    return;
  }

  await prisma.$transaction(
    async (tx) => {
      for (const target of repairTargets) {
        const categoryId = categoryIdBySlug.get(target.expected.categorySlug)!;

        await tx.product.update({
          where: { id: target.id },
          data: {
            title: target.expected.title,
            description: target.expected.description,
            price: target.expected.price,
            condition: target.expected.condition,
            type: target.expected.type,
            categories: { set: [{ id: categoryId }] },
            images: {
              deleteMany: {},
              create: target.expected.images.map((url) => ({ url })),
            },
          },
        });
      }

      for (const rewrite of SAMPLE_MESSAGE_REWRITES) {
        await tx.message.updateMany({
          where: { content: rewrite.from },
          data: { content: rewrite.to },
        });
      }
      await tx.exchangeRequest.updateMany({
        where: { message: LEGACY_EXCHANGE_MESSAGE },
        data: { message: REPAIRED_EXCHANGE_MESSAGE },
      });

      const repairedProducts = await tx.product.findMany({
        where: { id: { in: repairTargets.map((target) => target.id) } },
        include: { images: true, categories: true },
      });
      const repairedById = new Map(
        repairedProducts.map((product) => [product.id, product]),
      );

      for (const target of repairTargets) {
        const repaired = repairedById.get(target.id);
        const expectedImage = target.expected.images[0];

        if (
          !repaired ||
          repaired.title !== target.expected.title ||
          repaired.description !== target.expected.description ||
          repaired.categories?.[0]?.id !==
            categoryIdBySlug.get(target.expected.categorySlug) ||
          repaired.images.length !== 1 ||
          repaired.images[0]?.url !== expectedImage
        ) {
          throw new Error(
            `Verification failed while repairing "${target.currentTitle}".`,
          );
        }
      }

      const [legacyMessageCount, legacyExchangeCount] = await Promise.all([
        tx.message.count({
          where: {
            content: {
              in: SAMPLE_MESSAGE_REWRITES.map((rewrite) => rewrite.from),
            },
          },
        }),
        tx.exchangeRequest.count({
          where: { message: LEGACY_EXCHANGE_MESSAGE },
        }),
      ]);

      if (legacyMessageCount > 0 || legacyExchangeCount > 0) {
        throw new Error(
          'Legacy sample conversation references were not repaired.',
        );
      }
    },
    { maxWait: 10_000, timeout: 120_000 },
  );

  console.log(
    `Successfully repaired and verified ${repairTargets.length} products without changing product IDs, owners, locations, statuses, message IDs, or exchange-request IDs.`,
  );
}

main()
  .catch((error) => {
    console.error('Product data repair failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
