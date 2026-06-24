import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { ProductStatus } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(ownerId: string, dto: CreateProductDto) {
    const { images, location, ...productData } = dto;

    return this.prisma.product.create({
      data: {
        ...productData,
        ownerId,
        images: images?.length
          ? { create: images.map((url) => ({ url })) }
          : undefined,
        location: location
          ? {
              create: {
                address: location.address,
                latitude: location.latitude,
                longitude: location.longitude,
              },
            }
          : undefined,
      },
      include: {
        images: true,
        location: true,
        category: true,
        owner: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
    });
  }

  async findAll(query: QueryProductDto) {
    const {
      keyword,
      categoryId,
      type,
      status,
      minPrice,
      maxPrice,
      page = 1,
      limit = 12,
    } = query;

    const where: any = {
      status: status || ProductStatus.AVAILABLE,
    };

    if (keyword) {
      where.OR = [
        { title: { contains: keyword, mode: 'insensitive' } },
        { description: { contains: keyword, mode: 'insensitive' } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
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
          category: true,
          owner: {
            select: { id: true, name: true, avatar: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
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
        category: true,
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
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, userId: string, dto: UpdateProductDto) {
    const product = await this.findOne(id);

    if (product.ownerId !== userId) {
      throw new ForbiddenException('You can only edit your own products');
    }

    const { images, location, ...productData } = dto;

    return this.prisma.product.update({
      where: { id },
      data: {
        ...productData,
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
                },
                update: {
                  address: location.address,
                  latitude: location.latitude,
                  longitude: location.longitude,
                },
              },
            }
          : undefined,
      },
      include: {
        images: true,
        location: true,
        category: true,
        owner: {
          select: { id: true, name: true, email: true },
        },
      },
    });
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
}
