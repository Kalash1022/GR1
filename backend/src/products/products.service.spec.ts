import { BadRequestException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { PrismaService } from '../prisma/prisma.service';
import { ExchangeType } from '@prisma/client';

describe('ProductsService regressions', () => {
  const product = { id: 'product-1', ownerId: 'owner-1' };
  let prisma: {
    product: { create: jest.Mock; findUnique: jest.Mock; findMany: jest.Mock };
    $queryRaw: jest.Mock;
  };
  let service: ProductsService;

  beforeEach(() => {
    prisma = {
      product: {
        create: jest.fn().mockResolvedValue(product),
        findUnique: jest.fn().mockResolvedValue(product),
        findMany: jest.fn().mockResolvedValue([]),
      },
      $queryRaw: jest.fn().mockResolvedValue([{ count: 0 }]),
    };
    service = new ProductsService(prisma as unknown as PrismaService);
  });

  it('creates category and normalized tag relations rather than raw DTO arrays', async () => {
    await service.create('owner-1', {
      title: 'Used phone', description: 'Working phone', type: ExchangeType.SELL,
      categoryIds: ['category-1', 'category-2'], tags: [' Phone ', 'phone', ''],
      attributes: { memory: '128GB' },
    });
    const data = prisma.product.create.mock.calls[0][0].data;
    expect(data.categoryIds).toBeUndefined();
    expect(data.categories).toEqual({ connect: [{ id: 'category-1' }, { id: 'category-2' }] });
    expect(data.tags).toEqual({ connectOrCreate: [{ where: { name: 'phone' }, create: { name: 'phone' } }] });
    expect(data.attributes).toEqual({ memory: '128GB' });
  });

  it('rejects a partial coordinate before writing a product', async () => {
    await expect(service.create('owner-1', {
      title: 'Phone', description: 'Used phone', type: ExchangeType.SELL,
      categoryIds: ['category-1'], location: { address: 'Ha Noi', latitude: 21 },
    })).rejects.toBeInstanceOf(BadRequestException);
    expect(prisma.product.create).not.toHaveBeenCalled();
  });

  it('filters keyword searches by category relation and mapped tags table', async () => {
    prisma.$queryRaw.mockResolvedValueOnce([{ count: 0 }]).mockResolvedValueOnce([]);
    const result = await service.search({ keyword: 'phone', categoryId: 'category-1', tag: 'phone' });
    const query = prisma.$queryRaw.mock.calls[0][0];
    expect(query.sql).toContain('"_CategoryToProduct"');
    expect(query.sql).not.toContain('p."categoryId"');
    expect(query.sql).toContain('JOIN tags t');
    expect(query.values).toContain('category-1');
    expect(query.values).toContain('phone');
    expect(result.meta.total).toBe(0);
  });

  it('uses the mapped tags table in a radius search', async () => {
    prisma.$queryRaw.mockResolvedValueOnce([{ count: 0 }]).mockResolvedValueOnce([]);
    await service.search({ lat: 21, lng: 105, tag: 'phone' });
    expect(prisma.$queryRaw.mock.calls[0][0].sql).toContain('JOIN tags t');
  });
});
