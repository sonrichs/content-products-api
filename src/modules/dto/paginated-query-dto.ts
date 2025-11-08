import { IsOptional, IsInt, Min, Max } from 'class-validator';
import {
  PAGINATION_MAX_LIMIT,
  PAGINATION_MIN_LIMIT,
  PAGINATION_MIN_SKIP,
} from 'src/config/constants';

export class PaginatedQueryDto {
  @IsOptional()
  @IsInt()
  @Min(PAGINATION_MIN_SKIP)
  skip?: number;

  @IsOptional()
  @IsInt()
  @Min(PAGINATION_MIN_LIMIT)
  @Max(PAGINATION_MAX_LIMIT)
  limit?: number;
}
