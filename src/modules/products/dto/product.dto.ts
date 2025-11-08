import { Expose } from 'class-transformer';

export class ProductDto {
  @Expose()
  id: string;

  @Expose()
  sku: string;

  @Expose()
  name: string;

  @Expose()
  brand: string;

  @Expose()
  model: string;

  @Expose()
  category: string;

  @Expose()
  color: string;

  @Expose()
  price: number;

  @Expose()
  currency: string;

  @Expose()
  stock: number;
}
