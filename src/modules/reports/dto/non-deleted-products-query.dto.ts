import { Transform } from 'class-transformer';
import { IsBoolean, IsDateString, IsOptional } from 'class-validator';

export class NonDeletedProductsQueryDto {
  // Transform because query params are always strings
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
  })
  @IsBoolean()
  withPrice: boolean;

  @IsDateString()
  @IsOptional()
  createdAtFrom?: Date;

  @IsDateString()
  @IsOptional()
  createdAtTo?: Date;
}
