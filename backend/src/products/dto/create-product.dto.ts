import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsEnum,
  IsArray,
  ValidateNested,
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  Min,
  Max,
  IsObject,
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
  @Min(-90)
  @Max(90)
  @IsOptional()
  latitude?: number;

  @ApiPropertyOptional({ example: 106.660172 })
  @IsNumber()
  @Min(-180)
  @Max(180)
  @IsOptional()
  longitude?: number;

  @ApiPropertyOptional({ example: 'hcm' })
  @IsString()
  @IsOptional()
  provinceId?: string;

  @ApiPropertyOptional({ example: 'hcm-q1' })
  @IsString()
  @IsOptional()
  districtId?: string;

  @ApiPropertyOptional({ example: 'hcm-q1-w1' })
  @IsString()
  @IsOptional()
  wardId?: string;
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

  @ApiProperty({ type: [String], example: ['category-uuid-1', 'category-uuid-2'] })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @ArrayMaxSize(3, { message: 'A product can belong to a maximum of 3 categories' })
  @IsString({ each: true })
  @IsNotEmpty()
  categoryIds: string[];

  @ApiPropertyOptional({ type: [String], example: ['iphone', '99%'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({ type: Object, example: { ram: '8GB', memory: '256GB' } })
  @IsObject()
  @IsOptional()
  attributes?: Record<string, any>;

  @ApiPropertyOptional({ example: 15000000 })
  @IsNumber()
  @Min(0)
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
