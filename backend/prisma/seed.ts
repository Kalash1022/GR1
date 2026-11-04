import {
  PrismaClient,
  UserRole,
  ExchangeType,
  ReportReason,
  ReportStatus,
} from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';
import { buildProductSeedData } from './product-data';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Clean up existing data to allow re-seeding
  console.log('🧹 Cleaning up old database entries...');
  await prisma.exchangeRequest.deleteMany();
  await prisma.message.deleteMany();
  await prisma.report.deleteMany();
  await prisma.location.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();
  console.log('✅ Clean up completed.');

  // 2. Create Categories
  console.log('📦 Seeding categories...');
  const categoriesData = [
    {
      name: 'Electronics', slug: 'electronics', icon: '📱',
      formSchema: [
        { name: 'brand', label: 'Thương hiệu', type: 'string', required: true },
        { name: 'warranty', label: 'Bảo hành (tháng)', type: 'number', required: false },
      ]
    },
    {
      name: 'Fashion', slug: 'fashion', icon: '👗',
      formSchema: [
        { name: 'size', label: 'Kích cỡ', type: 'select', options: ['S', 'M', 'L', 'XL'], required: true },
        { name: 'material', label: 'Chất liệu', type: 'string', required: false },
      ]
    },
    { name: 'Furniture', slug: 'furniture', icon: '🪑' },
    {
      name: 'Books', slug: 'books', icon: '📚',
      formSchema: [
        { name: 'author', label: 'Tác giả', type: 'string', required: true },
        { name: 'publisher', label: 'Nhà xuất bản', type: 'string', required: false },
      ]
    },
    { name: 'Sports', slug: 'sports', icon: '⚽' },
    { name: 'Vehicles', slug: 'vehicles', icon: '🚗' },
    { name: 'Home Appliances', slug: 'home-appliances', icon: '🏠' },
    { name: 'Toys & Games', slug: 'toys', icon: '🧸' },
    { name: 'Musical Instruments', slug: 'music', icon: '🎸' },
    { name: 'Other', slug: 'other', icon: '📦' },
  ];

  const categories = await Promise.all(
    categoriesData.map((cat) =>
      prisma.category.create({
        data: cat,
      })
    )
  );
  console.log(`✅ Created ${categories.length} categories.`);

  // Helper map to quickly get category IDs by slug
  const categoryMap = new Map(categories.map((c) => [c.slug, c.id]));

  // 3. Create Users (Admin, Providers, Seekers)
  console.log('👥 Seeding users...');
  const defaultPasswordHash = await bcrypt.hash('password123', 10);
  const adminPasswordHash = await bcrypt.hash('admin123', 10);

  // Admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@secondhand.com',
      password: adminPasswordHash,
      name: 'System Admin',
      phone: '0900000000',
      address: 'Hà Nội',
      role: UserRole.ADMIN,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    },
  });

  // Providers (Sellers)
  const sellersData = [
    {
      email: 'seller1@example.com',
      password: defaultPasswordHash,
      name: 'Nguyễn Văn Minh',
      phone: '0912345678',
      address: 'Quận 1, TP. Hồ Chí Minh',
      role: UserRole.PROVIDER,
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150',
    },
    {
      email: 'seller2@example.com',
      password: defaultPasswordHash,
      name: 'Trần Thị Thanh Vân',
      phone: '0987654321',
      address: 'Cầu Giấy, Hà Nội',
      role: UserRole.PROVIDER,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    },
    {
      email: 'seller3@example.com',
      password: defaultPasswordHash,
      name: 'Lê Hoàng Long',
      phone: '0905123456',
      address: 'Hải Châu, Đà Nẵng',
      role: UserRole.PROVIDER,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
    {
      email: 'seller4@example.com',
      password: defaultPasswordHash,
      name: 'Phạm Thanh Sơn',
      phone: '0945678901',
      address: 'Quận Bình Thạnh, TP. Hồ Chí Minh',
      role: UserRole.PROVIDER,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    },
    {
      email: 'seller5@example.com',
      password: defaultPasswordHash,
      name: 'Vũ Minh Anh',
      phone: '0956789012',
      address: 'Quận Tây Hồ, Hà Nội',
      role: UserRole.PROVIDER,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    },
    {
      email: 'lequangloi06032005@gmail.com',
      password: defaultPasswordHash,
      name: 'Lê Quang Lợi',
      phone: '0912345679',
      address: 'Quận 1, TP. Hồ Chí Minh',
      role: UserRole.PROVIDER,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    },
  ];

  const sellers = await Promise.all(
    sellersData.map((s) => prisma.user.create({ data: s }))
  );

  // Seekers (Buyers / Swappers)
  const buyersData = [
    {
      email: 'buyer1@example.com',
      password: defaultPasswordHash,
      name: 'Phạm Minh Đức',
      phone: '0933445566',
      address: 'Quận 7, TP. Hồ Chí Minh',
      role: UserRole.SEEKER,
      avatar: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=150',
    },
    {
      email: 'buyer2@example.com',
      password: defaultPasswordHash,
      name: 'Nguyễn Thu Trang',
      phone: '0966778899',
      address: 'Đống Đa, Hà Nội',
      role: UserRole.SEEKER,
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    },
    {
      email: 'buyer3@example.com',
      password: defaultPasswordHash,
      name: 'Đỗ Quốc Anh',
      phone: '0977889900',
      address: 'Ninh Kiều, Cần Thơ',
      role: UserRole.SEEKER,
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
    },
    {
      email: 'buyer4@example.com',
      password: defaultPasswordHash,
      name: 'Lâm Khánh Chi',
      phone: '0988112233',
      address: 'Quận 3, TP. Hồ Chí Minh',
      role: UserRole.SEEKER,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    },
    {
      email: 'buyer5@example.com',
      password: defaultPasswordHash,
      name: 'Hoàng Quốc Việt',
      phone: '0977223344',
      address: 'Quận Cầu Giấy, Hà Nội',
      role: UserRole.SEEKER,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    },
  ];

  const buyers = await Promise.all(
    buyersData.map((b) => prisma.user.create({ data: b }))
  );

  console.log(`✅ Created admin and ${sellers.length + buyers.length} users.`);

  // Create User Preferences
  console.log('⚙️ Seeding user preferences...');
  const allUsers = [...sellers, ...buyers, admin];
  for (const u of allUsers) {
    const preferredCatIds = [
      categories[Math.floor(Math.random() * categories.length)].id,
      categories[Math.floor(Math.random() * categories.length)].id,
    ];
    await prisma.userPreference.create({
      data: {
        userId: u.id,
        preferredCategories: Array.from(new Set(preferredCatIds)),
        preferredLocations: u.address ? [u.address] : [],
        preferredTypes: [ExchangeType.SELL, ExchangeType.EXCHANGE],
        priceRangeMin: 0,
        priceRangeMax: 50000000,
      },
    });
  }
  console.log('✅ Created user preferences.');

  // 4. Create Products
  console.log('🛍️ Seeding products...');

  const productsData = buildProductSeedData();

  // Helper for admin boundary in seed
  const getAdminBoundary = (address: string) => {
    if (address.includes('Quận 1')) return { provinceId: 'hcm', districtId: 'hcm-q1' };
    if (address.includes('Bình Thạnh')) return { provinceId: 'hcm', districtId: 'hcm-bt' };
    if (address.includes('Cầu Giấy')) return { provinceId: 'hn', districtId: 'hn-cg' };
    if (address.includes('Đống Đa')) return { provinceId: 'hn', districtId: 'hn-dd' };
    if (address.includes('Ninh Kiều')) return { provinceId: 'ct', districtId: 'ct-nk' };
    if (address.includes('Hải Châu')) return { provinceId: 'dn', districtId: 'dn-hc' };
    return { provinceId: null, districtId: null };
  };

  // Insert products and link user and category
  const dbUsers = [...sellers, ...buyers, admin];
  const userMap = new Map(dbUsers.map((u) => [u.email, u.id]));

  const createdProducts = [];

  for (const prod of productsData) {
    const categoryId = categoryMap.get(prod.categorySlug);
    const ownerId = userMap.get(prod.ownerEmail);

    if (!categoryId || !ownerId) {
      console.warn(`⚠️ Skipped product "${prod.title}" because category or owner was not found.`);
      continue;
    }

    const boundary = getAdminBoundary(prod.location.address);

    const createdProduct = await prisma.product.create({
      data: {
        title: prod.title,
        description: prod.description,
        price: prod.price,
        condition: prod.condition,
        type: prod.type,
        status: prod.status,
        ownerId: ownerId,
        categories: { connect: [{ id: categoryId }] },
        images: {
          create: prod.images.map((url: string) => ({ url })),
        },
        location: {
          create: {
            address: prod.location.address,
            latitude: prod.location.latitude,
            longitude: prod.location.longitude,
            provinceId: boundary.provinceId,
            districtId: boundary.districtId,
          },
        },
      },
    });

    if (prod.location.latitude && prod.location.longitude) {
      await prisma.$executeRawUnsafe(
        `UPDATE locations SET location = ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography WHERE "productId" = $3`,
        prod.location.longitude,
        prod.location.latitude,
        createdProduct.id
      );
    }

    createdProducts.push(createdProduct);
  }

  console.log(`✅ Created ${createdProducts.length} sample products.`);

  // 5. Create Sample Messages
  console.log('💬 Seeding messages...');
  const buyer1Id = userMap.get('buyer1@example.com')!;
  const seller1Id = userMap.get('seller1@example.com')!;
  const buyer2Id = userMap.get('buyer2@example.com')!;
  const seller2Id = userMap.get('seller2@example.com')!;
  const buyer3Id = userMap.get('buyer3@example.com')!;

  const messagesData = [
    {
      senderId: buyer1Id,
      receiverId: seller1Id,
      content: 'Chào anh Minh, chiếc iPhone Pro 256GB còn fix thêm chút lộc lá nào không ạ?',
      createdAt: new Date(Date.now() - 4 * 3600000), // 4 hours ago
    },
    {
      senderId: seller1Id,
      receiverId: buyer1Id,
      content: 'Chào bạn Đức, nếu bạn qua lấy trực tiếp mình bớt 200k tiền xăng xe nhé!',
      createdAt: new Date(Date.now() - 3.5 * 3600000),
    },
    {
      senderId: buyer1Id,
      receiverId: seller1Id,
      content: 'Dạ tối nay tầm 7h em qua xem máy ở Quận 1 được không anh?',
      createdAt: new Date(Date.now() - 3 * 3600000),
    },
    {
      senderId: seller1Id,
      receiverId: buyer1Id,
      content: 'Ok bạn, tới nơi gọi điện thoại mình dắt vào nhà xem máy nhé.',
      createdAt: new Date(Date.now() - 2.5 * 3600000),
    },

    // Thread 2
    {
      senderId: buyer2Id,
      receiverId: seller2Id,
      content: 'Chị Vân ơi, bàn phím cơ compact này có sẵn đầu thu USB không ạ?',
      createdAt: new Date(Date.now() - 2 * 3600000),
    },
    {
      senderId: seller2Id,
      receiverId: buyer2Id,
      content: 'Bàn phím này dùng kết nối Bluetooth hoặc cắm cáp Type-C trực tiếp em nha, không dùng đầu thu USB 2.4 GHz.',
      createdAt: new Date(Date.now() - 1.8 * 3600000),
    },
  ];

  for (const msg of messagesData) {
    await prisma.message.create({
      data: msg,
    });
  }
  console.log('✅ Created sample messages.');

  // 6. Create Exchange Request
  console.log('🔄 Seeding exchange requests...');
  // Find products for exchange
  const fixedGearBike = createdProducts.find((p) => p.title.includes('Xe đạp fixed gear khung trắng'));
  const compactKeyboard = createdProducts.find((p) => p.title.includes('Bàn phím cơ compact LED RGB'));

  if (fixedGearBike && compactKeyboard) {
    await prisma.exchangeRequest.create({
      data: {
        message: 'Chào bạn, mình muốn đổi chiếc xe đạp fixed gear lấy bàn phím cơ compact của bạn được không? Mình có thể bù thêm chút tiền nếu cần.',
        status: 'PENDING',
        requesterId: buyer1Id, // Owner of the fixed-gear bicycle
        receiverId: seller2Id, // Owner of the compact keyboard
        offeredProductId: fixedGearBike.id,
        wantedProductId: compactKeyboard.id,
      },
    });
    console.log('✅ Created a sample exchange request.');
  }

  // 7. Create Sample Reports
  console.log('🚨 Seeding sample reports...');
  const spamProduct = createdProducts[0]; // iPhone Pro
  if (spamProduct) {
    await prisma.report.create({
      data: {
        reason: ReportReason.SPAM,
        details: 'Tài khoản đăng bán quá nhiều sản phẩm trùng lặp trong thời gian ngắn.',
        status: ReportStatus.PENDING,
        reporterId: buyer3Id,
        targetUserId: seller1Id,
        targetProductId: spamProduct.id,
      },
    });
    console.log('✅ Created a sample report.');
  }

  console.log('🎉 Seeding database successfully completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
