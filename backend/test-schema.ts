import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  try {
    const c2p = await prisma.$queryRawUnsafe(`SELECT * FROM "_CategoryToProduct" LIMIT 1`);
    console.log('_CategoryToProduct:', c2p);
    const p2t = await prisma.$queryRawUnsafe(`SELECT * FROM "_ProductToTag" LIMIT 1`);
    console.log('_ProductToTag:', p2t);
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
