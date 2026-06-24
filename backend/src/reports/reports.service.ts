import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReportDto } from './dto/create-report.dto';
import { HandleReportDto } from './dto/handle-report.dto';
import { ReportStatus } from '@prisma/client';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(reporterId: string, dto: CreateReportDto) {
    return this.prisma.report.create({
      data: {
        reason: dto.reason,
        details: dto.details,
        reporterId,
        targetUserId: dto.targetUserId,
        targetProductId: dto.targetProductId,
      },
      include: {
        reporter: {
          select: { id: true, name: true },
        },
      },
    });
  }

  async findAll(status?: ReportStatus) {
    return this.prisma.report.findMany({
      where: status ? { status } : undefined,
      include: {
        reporter: {
          select: { id: true, name: true, email: true },
        },
        targetUser: {
          select: { id: true, name: true, email: true, isActive: true },
        },
        targetProduct: {
          select: { id: true, title: true, status: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const report = await this.prisma.report.findUnique({
      where: { id },
      include: {
        reporter: {
          select: { id: true, name: true, email: true },
        },
        targetUser: {
          select: { id: true, name: true, email: true, isActive: true },
        },
        targetProduct: {
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            owner: { select: { id: true, name: true } },
          },
        },
      },
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }
    return report;
  }

  async handle(id: string, dto: HandleReportDto) {
    const report = await this.findOne(id);

    // Update report status
    const updatedReport = await this.prisma.report.update({
      where: { id },
      data: { status: dto.status },
    });

    // Execute admin action
    if (dto.blockUser && report.targetUserId) {
      await this.prisma.user.update({
        where: { id: report.targetUserId },
        data: { isActive: false },
      });
    }

    if (dto.blockProduct && report.targetProductId) {
      await this.prisma.product.delete({
        where: { id: report.targetProductId },
      });
    }

    return updatedReport;
  }
}
