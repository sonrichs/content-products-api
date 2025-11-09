import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../products/entities/product.entity';
import { Repository } from 'typeorm';
import { NonDeletedProductsQueryDto } from './dto/non-deleted-products-query.dto';
import { NonDeletedProductsReportDto } from './dto/non-deleted-products-report.dto';
import { DeletedProductsReportDto } from './dto/deleted-products-report.dto';
import { ProductCategoryBreakdownDto } from './dto/product-category-breakdown.dto';
import {
  applyBooleanToNumericFilter,
  applyDateRangeFilter,
} from './utils/report-qb.utils';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Product)
    private readonly repository: Repository<Product>,
  ) {}

  async getDeletedProductsPercentage(): Promise<DeletedProductsReportDto> {
    const totalProducts = await this.repository.count({ withDeleted: true });
    const nonDeletedProducts = await this.repository.count();
    const deletedProducts = totalProducts - nonDeletedProducts;
    return {
      total: totalProducts,
      count: deletedProducts,
      percentage: Math.ceil((deletedProducts / totalProducts) * 100),
    };
  }

  async getNonDeletedProductsPercentage(
    query: NonDeletedProductsQueryDto,
  ): Promise<NonDeletedProductsReportDto> {
    const { withPrice, createdAtFrom, createdAtTo } = query;

    // Total non deleted products with date range filters
    let qbTotalProducts = this.repository.createQueryBuilder('product');
    qbTotalProducts = applyDateRangeFilter(
      qbTotalProducts,
      'createdAt',
      createdAtFrom,
      createdAtTo,
    );

    // Non deleted products with all query filters
    let qbNonDeleted = this.repository.createQueryBuilder('product');
    qbNonDeleted = applyDateRangeFilter(
      qbNonDeleted,
      'createdAt',
      createdAtFrom,
      createdAtTo,
    );
    qbNonDeleted = applyBooleanToNumericFilter(
      qbNonDeleted,
      'price',
      withPrice,
    );

    const totalProducts = await qbTotalProducts.getCount();
    const nonDeletedProducts = await qbNonDeleted.getCount();

    return {
      total: totalProducts,
      count: nonDeletedProducts,
      percentage: Math.ceil((nonDeletedProducts / totalProducts) * 100),
    };
  }

  async getProductCategoryBreakdown(): Promise<ProductCategoryBreakdownDto[]> {
    interface RawResult {
      category: string;
      totalProducts: string;
      totalStock: string;
      averagePrice: string;
      inventoryValue: string;
    }

    const results = await this.repository
      .createQueryBuilder('product')
      .select('product.category', 'category')
      .addSelect('COUNT(product.id)', 'totalProducts')
      .addSelect('COALESCE(SUM(product.stock), 0)', 'totalStock')
      .addSelect('COALESCE(AVG(product.price), 0)', 'averagePrice')
      .addSelect(
        'COALESCE(SUM(product.price * product.stock), 0)',
        'inventoryValue',
      )
      .groupBy('product.category')
      // Double colon because of case sensitivity
      .orderBy('"inventoryValue"', 'DESC')
      .getRawMany<RawResult>();

    return results.map((r) => ({
      category: r.category,
      totalProducts: parseInt(r.totalProducts),
      totalStock: parseInt(r.totalStock),
      averagePrice: parseFloat(r.averagePrice),
      inventoryValue: parseFloat(r.inventoryValue),
    }));
  }
}
