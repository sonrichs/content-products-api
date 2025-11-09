import { Expose } from 'class-transformer';

export class ProductCategoryBreakdownDto {
  @Expose()
  category: string;

  @Expose()
  totalProducts: number;

  @Expose()
  totalStock: number;

  @Expose()
  averagePrice: number;

  @Expose()
  inventoryValue: number;
}
