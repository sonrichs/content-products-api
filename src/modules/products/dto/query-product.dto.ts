import { IsNumber, IsOptional, IsString, Length, Min } from 'class-validator';
import { PaginatedQueryDto } from '../../dto/paginated-query-dto';

export class QueryProductDto extends PaginatedQueryDto {
  @IsString()
  @Length(1, 100)
  @IsOptional()
  sku?: string;

  @IsString()
  @Length(1, 255)
  @IsOptional()
  name?: string;

  @IsString()
  @Length(1, 255)
  @IsOptional()
  brand?: string;

  @IsString()
  @Length(1, 255)
  @IsOptional()
  model?: string;

  @IsString()
  @Length(1, 255)
  @IsOptional()
  category?: string;

  @IsString()
  @Length(1, 255)
  @IsOptional()
  color?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  minPrice?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  maxPrice?: number;

  @IsString()
  @Length(3)
  @IsOptional()
  currency?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  stock?: number;

  @IsOptional()
  createdAt?: Date;

  @IsOptional()
  updatedAt?: Date;
}
