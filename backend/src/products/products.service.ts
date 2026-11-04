import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { SearchProductsDto } from './dto/search-products.dto';
import { ProductStatus, Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) { }

  private async updateGeographyLocation(
    productId: string,
    latitude?: number,
    longitude?: number,
  ) {
    if (
      latitude !== undefined &&
      latitude !== null &&
      longitude !== undefined &&
      longitude !== null
    ) {
      await this.prisma.$executeRaw`
        UPDATE locations
        SET location = ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography
        WHERE "productId" = ${productId}
      `;
    } else {
      await this.prisma.$executeRaw`
        UPDATE locations
        SET location = NULL
        WHERE "productId" = ${productId}
      `;
    }
  }

  async create(ownerId: string, dto: CreateProductDto) {
    const { images, location, categoryIds, tags, ...productData } = dto;

    if (location) {
      const hasLat = location.latitude !== undefined && location.latitude !== null;
      const hasLng = location.longitude !== undefined && location.longitude !== null;
      if (hasLat !== hasLng) {
        throw new BadRequestException(
          'Both latitude and longitude must be provided together or both omitted',
        );
      }
    }

    const product = await this.prisma.product.create({
      data: {
        ...productData,
        ownerId,
        categories: { connect: categoryIds.map((id) => ({ id })) },
        tags: tags?.length
          ? {
              connectOrCreate: [...new Set(tags.map((tag) => tag.trim().toLowerCase()).filter(Boolean))]
                .map((name) => ({ where: { name }, create: { name } })),
            }
          : undefined,
        images: images?.length
          ? { create: images.map((url) => ({ url })) }
          : undefined,
        location: location
          ? {
            create: {
              address: location.address,
              latitude: location.latitude,
              longitude: location.longitude,
              provinceId: location.provinceId,
              districtId: location.districtId,
              wardId: location.wardId,
            },
          }
          : undefined,
      },
      include: {
        images: true,
        location: true,
        categories: true,
        tags: true,
        owner: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
    });

    if (location) {
      await this.updateGeographyLocation(
        product.id,
        location.latitude,
        location.longitude,
      );
    }

    return this.findOne(product.id);
  }

  async findAll(query: QueryProductDto) {
    const {
      keyword,
      categoryId,
      tag,
      type,
      status,
      minPrice,
      maxPrice,
      page = 1,
      limit = 12,
    } = query;

    const offset = (page - 1) * limit;

    if (keyword) {
      const words = keyword.trim().split(/\s+/);
      const conditions: Prisma.Sql[] = [
        Prisma.sql`p.status = ${status || ProductStatus.AVAILABLE}::"ProductStatus"`,
        Prisma.sql`u."isActive" = true`,
      ];

      if (categoryId) {
        conditions.push(Prisma.sql`EXISTS (SELECT 1 FROM "_CategoryToProduct" c2p WHERE c2p."B" = p.id AND c2p."A" = ${categoryId})`);
      }
      if (tag) {
        conditions.push(Prisma.sql`EXISTS (SELECT 1 FROM "_ProductToTag" p2t JOIN tags t ON p2t."B" = t.id WHERE p2t."A" = p.id AND t.name = ${tag})`);
      }
      if (type) conditions.push(Prisma.sql`p.type = ${type}::"ExchangeType"`);
      if (minPrice !== undefined) conditions.push(Prisma.sql`p.price >= ${minPrice}`);
      if (maxPrice !== undefined) conditions.push(Prisma.sql`p.price <= ${maxPrice}`);

      const keywordConditions = words.map(
        (word) =>
          Prisma.sql`(unaccent(p.title) ILIKE unaccent(${'%' + word + '%'}) OR unaccent(p.description) ILIKE unaccent(${'%' + word + '%'}))`,
      );
      conditions.push(Prisma.sql`(${Prisma.join(keywordConditions, ' OR ')})`);

      const scoreSelects = words.map(
        (word) =>
          Prisma.sql`(CASE WHEN unaccent(p.title) ILIKE unaccent(${'%' + word + '%'}) THEN 2 ELSE 0 END + CASE WHEN unaccent(p.description) ILIKE unaccent(${'%' + word + '%'}) THEN 1 ELSE 0 END)`,
      );
      const relevanceSql = Prisma.sql`(${Prisma.join(scoreSelects, ' + ')})`;

      const whereClause = Prisma.join(conditions, ' AND ');

      const countQuery = Prisma.sql`SELECT COUNT(p.id)::int as count FROM products p JOIN users u ON p."ownerId" = u.id WHERE ${whereClause}`;
      const countResult = await this.prisma.$queryRaw<[{ count: number }]>(countQuery);
      const total = countResult[0]?.count || 0;

      const selectQuery = Prisma.sql`
        SELECT p.id
        FROM products p
        JOIN users u ON p."ownerId" = u.id
        WHERE ${whereClause}
        ORDER BY ${relevanceSql} DESC, p."createdAt" DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      const rawProducts = await this.prisma.$queryRaw<{ id: string }[]>(selectQuery);
      const ids = rawProducts.map((p) => p.id);

      if (ids.length === 0) {
        return {
          data: [],
          meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
      }

      const products = await this.prisma.product.findMany({
        where: { id: { in: ids } },
        include: {
          images: true,
          location: true,
          categories: true,
          tags: true,
          owner: { select: { id: true, name: true, avatar: true } },
        },
      });

      const sortedData = ids
        .map((id) => products.find((p) => p.id === id))
        .filter((p) => p !== undefined);

      return {
        data: sortedData,
        meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
      };
    }

    const where: any = {
      status: status || ProductStatus.AVAILABLE,
      owner: { isActive: true },
    };

    if (categoryId) {
      where.categories = { some: { id: categoryId } };
    }

    if (tag) {
      where.tags = { some: { name: tag } };
    }

    if (type) {
      where.type = type;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: {
          images: true,
          location: true,
          categories: true,
          tags: true,
          owner: {
            select: { id: true, name: true, avatar: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        location: true,
        categories: true,
        tags: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
            createdAt: true,
            _count: { select: { products: true } },
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async findByOwner(ownerId: string) {
    return this.prisma.product.findMany({
      where: { ownerId },
      include: {
        images: true,
        location: true,
        categories: true,
        tags: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, userId: string, dto: UpdateProductDto) {
    const product = await this.findOne(id);

    if (product.ownerId !== userId) {
      throw new ForbiddenException('You can only edit your own products');
    }

    const { images, location, categoryIds, tags, attributes, ...productData } = dto;

    if (location) {
      const hasLat = location.latitude !== undefined && location.latitude !== null;
      const hasLng = location.longitude !== undefined && location.longitude !== null;
      if (hasLat !== hasLng) {
        throw new BadRequestException(
          'Both latitude and longitude must be provided together or both omitted',
        );
      }
    }

    await this.prisma.product.update({
      where: { id },
      data: {
        ...productData,
        attributes: attributes !== undefined ? attributes : undefined,
        categories: categoryIds
          ? { set: categoryIds.map((id) => ({ id })) }
          : undefined,
        tags: tags
          ? {
              set: [],
              connectOrCreate: [...new Set(tags.map((tag) => tag.trim().toLowerCase()).filter(Boolean))]
                .map((name) => ({ where: { name }, create: { name } })),
            }
          : undefined,
        images: images
          ? {
            deleteMany: {},
            create: images.map((url) => ({ url })),
          }
          : undefined,
        location: location
          ? {
            upsert: {
              create: {
                address: location.address,
                latitude: location.latitude,
                longitude: location.longitude,
                provinceId: location.provinceId,
                districtId: location.districtId,
                wardId: location.wardId,
              },
              update: {
                address: location.address,
                latitude: location.latitude,
                longitude: location.longitude,
                provinceId: location.provinceId,
                districtId: location.districtId,
                wardId: location.wardId,
              },
            },
          }
          : undefined,
      },
    });

    if (location) {
      await this.updateGeographyLocation(
        id,
        location.latitude,
        location.longitude,
      );
    }

    return this.findOne(id);
  }

  async remove(id: string, userId: string, userRole: string) {
    const product = await this.findOne(id);

    if (product.ownerId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException('You can only delete your own products');
    }

    await this.prisma.product.delete({ where: { id } });
    return { message: 'Product deleted successfully' };
  }

  async updateStatus(id: string, userId: string, status: ProductStatus) {
    const product = await this.findOne(id);

    if (product.ownerId !== userId) {
      throw new ForbiddenException(
        'You can only update status of your own products',
      );
    }

    return this.prisma.product.update({
      where: { id },
      data: { status },
    });
  }

  async search(query: SearchProductsDto) {
    const {
      lat,
      lng,
      radiusKm = 10,
      provinceId,
      districtId,
      wardId,
      categoryId,
      keyword,
      tag,
      sort,
      page = 1,
      limit = 20,
    } = query;

    const hasLat = lat !== undefined && lat !== null;
    const hasLng = lng !== undefined && lng !== null;
    if (hasLat !== hasLng) {
      throw new BadRequestException(
        'Both lat and lng must be provided together or both omitted',
      );
    }

    const offset = (page - 1) * limit;

    if (hasLat && hasLng) {
      const conditions: Prisma.Sql[] = [
        Prisma.sql`p.status = 'AVAILABLE'`,
        Prisma.sql`l.location IS NOT NULL`,
        Prisma.sql`u."isActive" = true`,
      ];

      if (categoryId) {
        conditions.push(Prisma.sql`EXISTS (SELECT 1 FROM "_CategoryToProduct" c2p WHERE c2p."B" = p.id AND c2p."A" = ${categoryId})`);
      }

      if (tag) {
        conditions.push(Prisma.sql`EXISTS (SELECT 1 FROM "_ProductToTag" p2t JOIN tags t ON p2t."B" = t.id WHERE p2t."A" = p.id AND t.name = ${tag})`);
      }

      let relevanceSql: Prisma.Sql | null = null;
      if (keyword) {
        const words = keyword.trim().split(/\s+/);
        const keywordConditions = words.map(
          (word) =>
            Prisma.sql`(unaccent(p.title) ILIKE unaccent(${'%' + word + '%'}) OR unaccent(p.description) ILIKE unaccent(${'%' + word + '%'}))`,
        );
        if (keywordConditions.length > 0) {
          conditions.push(
            Prisma.sql`(${Prisma.join(keywordConditions, ' OR ')})`,
          );

          const scoreSelects = words.map(
            (word) =>
              Prisma.sql`(CASE WHEN unaccent(p.title) ILIKE unaccent(${'%' + word + '%'}) THEN 2 ELSE 0 END + CASE WHEN unaccent(p.description) ILIKE unaccent(${'%' + word + '%'}) THEN 1 ELSE 0 END)`,
          );
          relevanceSql = Prisma.sql`(${Prisma.join(scoreSelects, ' + ')})`;
        }
      }

      if (provinceId) {
        conditions.push(Prisma.sql`l."provinceId" = ${provinceId}`);
      }

      if (districtId) {
        conditions.push(Prisma.sql`l."districtId" = ${districtId}`);
      }

      if (wardId) {
        conditions.push(Prisma.sql`l."wardId" = ${wardId}`);
      }

      const radiusMeters = radiusKm * 1000;
      conditions.push(Prisma.sql`
        ST_DWithin(
          l.location,
          ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography,
          ${radiusMeters}
        )
      `);

      const whereClause = Prisma.join(conditions, ' AND ');

      const countQuery = Prisma.sql`
        SELECT COUNT(DISTINCT p.id)::int as count
        FROM products p
        JOIN users u ON p."ownerId" = u.id
        LEFT JOIN locations l ON p.id = l."productId"
        WHERE ${whereClause}
      `;

      let total = 0;
      try {
        const countResult = await this.prisma.$queryRaw<[{ count: number }]>(
          countQuery,
        );
        total = countResult[0]?.count || 0;
      } catch (err: any) {
        throw new BadRequestException(
          'Spatial search query failed. Ensure PostGIS is installed and enabled: ' +
          err.message,
        );
      }

      const distanceSql = Prisma.sql`
        ST_Distance(
          l.location,
          ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography
        )
      `;

      let orderBySql = Prisma.sql`ORDER BY ${distanceSql} ASC`;
      if (sort === 'newest') {
        orderBySql = Prisma.sql`ORDER BY p."createdAt" DESC`;
      } else if (sort === 'price_asc') {
        orderBySql = Prisma.sql`ORDER BY p.price ASC NULLS LAST`;
      } else if (sort === 'price_desc') {
        orderBySql = Prisma.sql`ORDER BY p.price DESC NULLS LAST`;
      } else if (!sort && relevanceSql) {
        orderBySql = Prisma.sql`ORDER BY ${relevanceSql} DESC, ${distanceSql} ASC`;
      }

      const selectQuery = Prisma.sql`
        SELECT p.id, ${distanceSql} AS "distanceMeters"
        FROM products p
        JOIN users u ON p."ownerId" = u.id
        LEFT JOIN locations l ON p.id = l."productId"
        WHERE ${whereClause}
        ${orderBySql}
        LIMIT ${limit} OFFSET ${offset}
      `;

      const rawProducts = await this.prisma.$queryRaw<
        { id: string; distanceMeters: number }[]
      >(selectQuery);

      const ids = rawProducts.map((p) => p.id);

      if (ids.length === 0) {
        return {
          data: [],
          meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        };
      }

      const products = await this.prisma.product.findMany({
        where: { id: { in: ids } },
        include: {
          images: true,
          location: true,
          categories: true,
          tags: true,
          owner: {
            select: { id: true, name: true, avatar: true },
          },
        },
      });

      const sortedData = rawProducts
        .map((rp) => {
          const product = products.find((p) => p.id === rp.id);
          if (!product) return null;
          const distMeters = Math.round(Number(rp.distanceMeters));
          return {
            ...product,
            distanceMeters: distMeters,
            distanceKm: parseFloat((distMeters / 1000).toFixed(2)),
          };
        })
        .filter((p) => p !== null);

      return {
        data: sortedData,
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    }

    if (keyword) {
      const words = keyword.trim().split(/\s+/);
      const conditions: Prisma.Sql[] = [
        Prisma.sql`p.status = 'AVAILABLE'`,
        Prisma.sql`u."isActive" = true`,
      ];

      if (categoryId) {
        conditions.push(Prisma.sql`EXISTS (SELECT 1 FROM "_CategoryToProduct" c2p WHERE c2p."B" = p.id AND c2p."A" = ${categoryId})`);
      }

      if (tag) {
        conditions.push(Prisma.sql`EXISTS (SELECT 1 FROM "_ProductToTag" p2t JOIN tags t ON p2t."B" = t.id WHERE p2t."A" = p.id AND t.name = ${tag})`);
      }

      if (provinceId || districtId || wardId) {
        conditions.push(Prisma.sql`l.id IS NOT NULL`);
        if (provinceId) conditions.push(Prisma.sql`l."provinceId" = ${provinceId}`);
        if (districtId) conditions.push(Prisma.sql`l."districtId" = ${districtId}`);
        if (wardId) conditions.push(Prisma.sql`l."wardId" = ${wardId}`);
      }

      const keywordConditions = words.map(
        (word) =>
          Prisma.sql`(unaccent(p.title) ILIKE unaccent(${'%' + word + '%'}) OR unaccent(p.description) ILIKE unaccent(${'%' + word + '%'}))`,
      );
      if (keywordConditions.length > 0) {
        conditions.push(Prisma.sql`(${Prisma.join(keywordConditions, ' OR ')})`);
      }

      const scoreSelects = words.map(
        (word) =>
          Prisma.sql`(CASE WHEN unaccent(p.title) ILIKE unaccent(${'%' + word + '%'}) THEN 2 ELSE 0 END + CASE WHEN unaccent(p.description) ILIKE unaccent(${'%' + word + '%'}) THEN 1 ELSE 0 END)`,
      );
      const relevanceSql = Prisma.sql`(${Prisma.join(scoreSelects, ' + ')})`;

      const whereClause = Prisma.join(conditions, ' AND ');

      const countQuery = Prisma.sql`
        SELECT COUNT(DISTINCT p.id)::int as count
        FROM products p
        JOIN users u ON p."ownerId" = u.id
        LEFT JOIN locations l ON p.id = l."productId"
        WHERE ${whereClause}
      `;

      let total = 0;
      try {
        const countResult = await this.prisma.$queryRaw<[{ count: number }]>(countQuery);
        total = countResult[0]?.count || 0;
      } catch (err: any) {
        throw new BadRequestException('Query failed: ' + err.message);
      }

      let orderBySql = Prisma.sql`ORDER BY p."createdAt" DESC`;
      if (sort === 'price_asc') {
        orderBySql = Prisma.sql`ORDER BY p.price ASC NULLS LAST`;
      } else if (sort === 'price_desc') {
        orderBySql = Prisma.sql`ORDER BY p.price DESC NULLS LAST`;
      } else if (!sort) {
        orderBySql = Prisma.sql`ORDER BY ${relevanceSql} DESC, p."createdAt" DESC`;
      }

      const selectQuery = Prisma.sql`
        SELECT p.id
        FROM products p
        JOIN users u ON p."ownerId" = u.id
        LEFT JOIN locations l ON p.id = l."productId"
        WHERE ${whereClause}
        ${orderBySql}
        LIMIT ${limit} OFFSET ${offset}
      `;

      const rawProducts = await this.prisma.$queryRaw<{ id: string }[]>(selectQuery);
      const ids = rawProducts.map((p) => p.id);

      if (ids.length === 0) {
        return {
          data: [],
          meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
      }

      const products = await this.prisma.product.findMany({
        where: { id: { in: ids } },
        include: {
          images: true,
          location: true,
          categories: true,
          tags: true,
          owner: { select: { id: true, name: true, avatar: true } },
        },
      });

      const sortedData = ids
        .map((id) => products.find((p) => p.id === id))
        .filter((p) => p !== undefined);

      return {
        data: sortedData,
        meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
      };
    }

    const where: any = {
      status: ProductStatus.AVAILABLE,
      owner: { isActive: true },
    };

    if (categoryId) {
      where.categories = { some: { id: categoryId } };
    }

    if (tag) {
      where.tags = { some: { name: tag } };
    }

    if (provinceId || districtId || wardId) {
      where.location = {};
      if (provinceId) where.location.provinceId = provinceId;
      if (districtId) where.location.districtId = districtId;
      if (wardId) where.location.wardId = wardId;
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price_asc') {
      orderBy = { price: 'asc' };
    } else if (sort === 'price_desc') {
      orderBy = { price: 'desc' };
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: {
          images: true,
          location: true,
          categories: true,
          tags: true,
          owner: {
            select: { id: true, name: true, avatar: true },
          },
        },
        orderBy,
        skip: offset,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
