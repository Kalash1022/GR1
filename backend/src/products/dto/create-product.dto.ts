import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsEnum,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ExchangeType, ProductCondition } from '@prisma/client';

export class LocationDto {
  @ApiProperty({ example: 'Ho Chi Minh City' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiPropertyOptional({ example: 10.762622 })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiPropertyOptional({ example: 106.660172 })
  @IsNumber()
  @IsOptional()
  longitude?: number;
}

export class CreateProductDto {
  @ApiProperty({ example: 'iPhone 14 Pro Max - Like New' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Selling my iPhone 14 Pro Max, used for 6 months...' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'category-uuid-here' })
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiPropertyOptional({ example: 15000000 })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({ enum: ProductCondition, default: ProductCondition.GOOD })
  @IsEnum(ProductCondition)
  @IsOptional()
  condition?: ProductCondition;

  @ApiProperty({ enum: ExchangeType, default: ExchangeType.SELL })
  @IsEnum(ExchangeType)
  type: ExchangeType;

  @ApiPropertyOptional({
    type: [String],
    example: ['https://example.com/image1.jpg'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @ApiPropertyOptional({ type: LocationDto })
  @ValidateNested()
  @Type(() => LocationDto)
  @IsOptional()
  location?: LocationDto;
}
