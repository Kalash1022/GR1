import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ReportReason } from '@prisma/client';

export class CreateReportDto {
  @ApiProperty({ enum: ReportReason })
  @IsEnum(ReportReason)
  @IsNotEmpty()
  reason: ReportReason;

  @ApiPropertyOptional({ example: 'This product listing is a scam' })
  @IsString()
  @IsOptional()
  details?: string;

  @ApiPropertyOptional({ example: 'user-uuid-here' })
  @IsString()
  @IsOptional()
  targetUserId?: string;

  @ApiPropertyOptional({ example: 'product-uuid-here' })
  @IsString()
  @IsOptional()
  targetProductId?: string;
}
