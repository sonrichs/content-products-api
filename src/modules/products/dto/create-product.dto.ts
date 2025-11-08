import { IsNumber, IsString, Length, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @Length(1, 100)
  sku: string;

  @IsString()
  @Length(1, 255)
  name: string;

  @IsString()
  @Length(1, 255)
  brand: string;

  @IsString()
  @Length(1, 255)
  model: string;

  @IsString()
  @Length(1, 255)
  category: string;

  @IsString()
  @Length(1, 255)
  color: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  @Length(3, 3)
  currency: string;

  @IsNumber()
  @Min(0)
  stock: number;
}
