import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { Paginated } from 'src/modules/dto/paginated.dto';
import { plainToInstance } from 'class-transformer';
import { ProductDto } from './dto/product.dto';
import {
  PAGINATION_DEFAULT_SKIP,
  PAGINATION_DEFAULT_LIMIT,
} from '../../config/constants';
import { getNumberRangeFindOperator } from '../utils/find-operators';

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
    // Pagination controls
    const { skip = PAGINATION_DEFAULT_SKIP, limit = PAGINATION_DEFAULT_LIMIT } =
      query;

    // Filter controls
    const filters = {
      sku: query.sku,
      name: query.name,
      brand: query.brand,
      model: query.model,
      category: query.category,
      color: query.color,
      currency: query.currency,
    };

    // Price range filter controls
    const { minPrice, maxPrice } = query;
    const priceFilter = getNumberRangeFindOperator(minPrice, maxPrice);

    // Adding price filter if defined
    if (priceFilter) {
      filters['price'] = priceFilter;
    }

    const [data, total] = await this.productsRepository.findAndCount({
      skip,
      take: limit,
      where: filters,
      order: { createdAt: 'DESC' },
    });

    // Manually transform entity to DTOs
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

  async remove(id: string) {
    const product = await this.findOne(id);
    if (!product) {
      throw new NotFoundException('Product not found or already deleted');
    }
    return this.productsRepository.softDelete(id);
  }
}
