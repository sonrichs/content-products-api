import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ProductsService } from '../modules/products/products.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(private readonly productsService: ProductsService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleProductsSync() {
    this.logger.log(
      `Running products synchronization task at ${new Date().toISOString()}`,
    );
    await this.productsService.syncProductsFromExternalApi();
    this.logger.log(
      `Products synchronization task completed at ${new Date().toISOString()}`,
    );
  }
}
