import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { Paginated } from '../../modules/dto/paginated.dto';
import { plainToInstance } from 'class-transformer';
import { ProductDto } from './dto/product.dto';
import {
  PAGINATION_DEFAULT_SKIP,
  PAGINATION_DEFAULT_LIMIT,
  PAGINATION_MIN_SKIP,
  PAGINATION_MIN_LIMIT,
  PAGINATION_MAX_LIMIT,
} from '../../config/constants';
import { getNumberRangeFindOperator } from '../utils/find-operators.utils';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { ContentfulProductFields } from './model/contentful-product';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const existingProduct = await this.findOneBySku(createProductDto.sku);
    if (existingProduct) {
      throw new ConflictException('Product SKU already exists');
    }
    const product = this.productsRepository.create(createProductDto);
    return this.productsRepository.upsert(product, ['sku']);
  }

  async upsertBatch(createProductDtoBatch: CreateProductDto[]) {
    const products = this.productsRepository.create(createProductDtoBatch);
    const result = await this.productsRepository.upsert(products, {
      conflictPaths: ['sku'],
      skipUpdateIfNoValuesChanged: true,
    });
    // POSSIBLE ENHANCEMENT: Process result to log created vs updated counts
    return result;
  }

  async findAll(query: QueryProductDto = {}): Promise<Paginated<ProductDto>> {
    // Pagination controls
    let { skip = PAGINATION_DEFAULT_SKIP, limit = PAGINATION_DEFAULT_LIMIT } =
      query;

    // Adjusting skip and limit values within configured ranges
    skip = Math.max(skip, PAGINATION_MIN_SKIP);
    this.logger.debug(`Adjusted skip value: ${skip}`);
    limit = Math.min(
      Math.max(limit, PAGINATION_MIN_LIMIT),
      PAGINATION_MAX_LIMIT,
    );
    this.logger.debug(`Adjusted limit value: ${limit}`);

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
    // TODO: Try to fix this with Serialize interceptor later
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

  async remove(id: string) {
    const product = await this.findOne(id);
    if (!product) {
      throw new NotFoundException('Product not found or already deleted');
    }
    return this.productsRepository.softDelete(id);
  }

  async syncProductsFromExternalApi() {
    const baseUrl = this.configService.get<string>('CONTENTFUL_BASE_URL');
    const path = this.configService.get<string>('CONTENTFUL_ENTRIES_PATH');
    const spaceId = this.configService.get<string>('CONTENTFUL_SPACE_ID');
    const environment = this.configService.get<string>(
      'CONTENTFUL_ENVIRONMENT',
    );
    const contentType = this.configService.get<string>(
      'CONTENTFUL_CONTENT_TYPE',
    );
    const accessToken = this.configService.get<string>(
      'CONTENTFUL_ACCESS_TOKEN',
    );

    if (
      !baseUrl ||
      !path ||
      !spaceId ||
      !environment ||
      !contentType ||
      !accessToken
    ) {
      throw new InternalServerErrorException(
        'Missing required External API configuration',
      );
    }

    const fullUrl = `${baseUrl}${path
      .replace('{spaceId}', spaceId)
      .replace(
        '{environment}',
        environment,
      )}?access_token=${accessToken}&content_type=${contentType}`;

    const { data } = await firstValueFrom(
      this.httpService.get<ContentfulProductFields>(fullUrl).pipe(
        catchError((error: AxiosError) => {
          this.logger.error('Error fetching products from external API:');
          this.logger.error(error.response?.data || error.message);
          throw new InternalServerErrorException('An error happened!');
        }),
      ),
    );
    const products = this.contentfulProductMapper(data);
    await this.upsertBatch(products);
    return 'OK';
  }

  contentfulProductMapper(
    contentfulProductfields: ContentfulProductFields,
  ): Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>[] {
    this.logger.log('Mapping products from Contentful response');
    this.logger.debug(
      `Contentful response has ${contentfulProductfields.items.length} items`,
    );
    return contentfulProductfields.items.map((item) => {
      this.logger.debug(`Mapping item with sku: ${item.fields.sku}`);
      return {
        sku: item.fields.sku,
        name: item.fields.name,
        brand: item.fields.brand,
        model: item.fields.model,
        category: item.fields.category,
        color: item.fields.color,
        price: item.fields.price,
        currency: item.fields.currency,
        stock: item.fields.stock,
      };
    });
  }
}
