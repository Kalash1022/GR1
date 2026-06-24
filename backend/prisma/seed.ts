import { PrismaClient, UserRole } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'electronics' },
      update: {},
      create: { name: 'Electronics', slug: 'electronics', icon: '📱' },
    }),
    prisma.category.upsert({
      where: { slug: 'fashion' },
      update: {},
      create: { name: 'Fashion', slug: 'fashion', icon: '👗' },
    }),
    prisma.category.upsert({
      where: { slug: 'furniture' },
      update: {},
      create: { name: 'Furniture', slug: 'furniture', icon: '🪑' },
    }),
    prisma.category.upsert({
      where: { slug: 'books' },
      update: {},
      create: { name: 'Books', slug: 'books', icon: '📚' },
    }),
    prisma.category.upsert({
      where: { slug: 'sports' },
      update: {},
      create: { name: 'Sports', slug: 'sports', icon: '⚽' },
    }),
    prisma.category.upsert({
      where: { slug: 'vehicles' },
      update: {},
      create: { name: 'Vehicles', slug: 'vehicles', icon: '🚗' },
    }),
    prisma.category.upsert({
      where: { slug: 'home-appliances' },
      update: {},
      create: { name: 'Home Appliances', slug: 'home-appliances', icon: '🏠' },
    }),
    prisma.category.upsert({
      where: { slug: 'toys' },
      update: {},
      create: { name: 'Toys & Games', slug: 'toys', icon: '🧸' },
    }),
    prisma.category.upsert({
      where: { slug: 'music' },
      update: {},
      create: { name: 'Musical Instruments', slug: 'music', icon: '🎸' },
    }),
    prisma.category.upsert({
      where: { slug: 'other' },
      update: {},
      create: { name: 'Other', slug: 'other', icon: '📦' },
    }),
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@secondhand.com' },
    update: {},
    create: {
      email: 'admin@secondhand.com',
      password: adminPassword,
      name: 'Admin',
      role: UserRole.ADMIN,
    },
  });
  console.log(`✅ Admin user created: ${admin.email}`);

  // Create sample provider
  const providerPassword = await bcrypt.hash('provider123', 10);
  const provider = await prisma.user.upsert({
    where: { email: 'provider@example.com' },
    update: {},
    create: {
      email: 'provider@example.com',
      password: providerPassword,
      name: 'Nguyen Van A',
      phone: '0901234567',
      address: 'Ho Chi Minh City',
      role: UserRole.PROVIDER,
    },
  });
  console.log(`✅ Provider user created: ${provider.email}`);

  // Create sample seeker
  const seekerPassword = await bcrypt.hash('seeker123', 10);
  const seeker = await prisma.user.upsert({
    where: { email: 'seeker@example.com' },
    update: {},
    create: {
      email: 'seeker@example.com',
      password: seekerPassword,
      name: 'Tran Thi B',
      phone: '0909876543',
      address: 'Hanoi',
      role: UserRole.SEEKER,
    },
  });
  console.log(`✅ Seeker user created: ${seeker.email}`);

  // Create sample products
  const sampleProducts = [
    {
      title: 'iPhone 14 Pro Max - Like New',
      description: 'Used for 6 months, battery health 98%. Comes with original box and accessories.',
      price: 22000000,
      condition: 'LIKE_NEW' as const,
      type: 'SELL' as const,
      categorySlug: 'electronics',
      location: { address: 'District 1, Ho Chi Minh City', latitude: 10.7769, longitude: 106.7009 },
      images: ['https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=600'],
    },
    {
      title: 'IKEA Standing Desk - Adjustable Height',
      description: 'Electric standing desk, 120x60cm. Perfect working condition.',
      price: 3500000,
      condition: 'GOOD' as const,
      type: 'SELL' as const,
      categorySlug: 'furniture',
      location: { address: 'Thu Duc City, Ho Chi Minh City', latitude: 10.8510, longitude: 106.7720 },
      images: ['https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600'],
    },
    {
      title: 'Collection of Programming Books',
      description: 'Clean Code, Design Patterns, and DDIA. All in great condition.',
      price: null,
      condition: 'GOOD' as const,
      type: 'DONATE' as const,
      categorySlug: 'books',
      location: { address: 'Cau Giay, Hanoi', latitude: 21.0381, longitude: 105.7723 },
      images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600'],
    },
    {
      title: 'Mountain Bike - Swap for Road Bike',
      description: 'Looking to exchange my mountain bike for a road bike of similar value.',
      price: null,
      condition: 'FAIR' as const,
      type: 'EXCHANGE' as const,
      categorySlug: 'sports',
      location: { address: 'District 7, Ho Chi Minh City', latitude: 10.7340, longitude: 106.7218 },
      images: ['https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600'],
    },
    {
      title: 'Samsung Galaxy Tab S9 FE',
      description: 'Excellent condition, comes with S Pen and keyboard cover.',
      price: 8500000,
      condition: 'LIKE_NEW' as const,
      type: 'SELL' as const,
      categorySlug: 'electronics',
      location: { address: 'Ba Dinh, Hanoi', latitude: 21.0362, longitude: 105.8341 },
      images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600'],
    },
    {
      title: 'Vintage Acoustic Guitar',
      description: 'Yamaha FG-180, great sound. Minor cosmetic wear.',
      price: 2000000,
      condition: 'FAIR' as const,
      type: 'SELL' as const,
      categorySlug: 'music',
      location: { address: 'District 3, Ho Chi Minh City', latitude: 10.7831, longitude: 106.6867 },
      images: ['https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600'],
    },
  ];

  for (const product of sampleProducts) {
    const category = categories.find(
      (c) => c.slug === product.categorySlug,
    );
    if (!category) continue;

    await prisma.product.create({
      data: {
        title: product.title,
        description: product.description,
        price: product.price,
        condition: product.condition,
        type: product.type,
        ownerId: provider.id,
        categoryId: category.id,
        images: {
          create: product.images.map((url) => ({ url })),
        },
        location: {
          create: product.location,
        },
      },
    });
  }
  console.log(`✅ Created ${sampleProducts.length} sample products`);

  console.log('🎉 Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
