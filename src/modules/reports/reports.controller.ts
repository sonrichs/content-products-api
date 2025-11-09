import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { DeletedProductsReportDto } from './dto/deleted-products-report.dto';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { NonDeletedProductsQueryDto } from './dto/non-deleted-products-query.dto';
import { NonDeletedProductsReportDto } from './dto/non-deleted-products-report.dto';
import { ProductCategoryBreakdownDto } from './dto/product-category-breakdown.dto';
import { JwtGuard } from '../../auth/guards/jwt.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller({ path: 'reports', version: '1' })
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('/products/deleted-percentage')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @Serialize(DeletedProductsReportDto)
  getDeletedProductsPercentage() {
    return this.reportsService.getDeletedProductsPercentage();
  }

  @Get('/products/non-deleted-percentage')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @Serialize(NonDeletedProductsReportDto)
  getNonDeletedProductsPercentage(@Query() query: NonDeletedProductsQueryDto) {
    return this.reportsService.getNonDeletedProductsPercentage(query);
  }

  @Get('/products/category-breakdown')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @Serialize(ProductCategoryBreakdownDto)
  getProductCategoryBreakdown() {
    return this.reportsService.getProductCategoryBreakdown();
  }
}
