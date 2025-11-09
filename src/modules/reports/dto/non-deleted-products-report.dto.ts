import { Expose } from 'class-transformer';

export class NonDeletedProductsReportDto {
  @Expose()
  total: number;

  @Expose()
  count: number;

  @Expose()
  percentage: number;
}
