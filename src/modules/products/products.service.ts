import { ConflictException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from '../dto/paginated-query-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { Paginated } from 'src/modules/dto/paginated.dto';
import { plainToInstance } from 'class-transformer';
import { ProductDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const existingProduct = await this.findOneBySku(createProductDto.sku);
    if (existingProduct) {
      throw new ConflictException('Product SKU already exists');
    }
    const product = this.productsRepository.create(createProductDto);
    return this.productsRepository.save(product);
  }

  async findAll(query: QueryProductDto): Promise<Paginated<ProductDto>> {
    const { skip = 0, limit = 5 } = query;

    const [data, total] = await this.productsRepository.findAndCount({
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    const transformedData = plainToInstance(ProductDto, data, {
      excludeExtraneousValues: true,
    });

    return {
      meta: {
        total,
        skip,
        limit,
      },
      data: transformedData,
    };
  }

  findOne(id: string) {
    return this.productsRepository.findOneBy({ id });
  }

  findOneBySku(sku: string) {
    return this.productsRepository.findOneBy({ sku });
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    return this.productsRepository.update(id, updateProductDto);
  }

  remove(id: string) {
    return this.productsRepository.delete(id);
  }
}
