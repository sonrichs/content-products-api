import { Expose } from 'class-transformer';

export class DeletedProductsReportDto {
  @Expose()
  total: number;

  @Expose()
  count: number;

  @Expose()
  percentage: number;
}
