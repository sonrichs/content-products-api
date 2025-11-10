import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ProductsModule } from '../modules/products/products.module';

@Module({
  imports: [ProductsModule, ScheduleModule.forRoot()],
  exports: [TasksService],
  controllers: [],
  providers: [TasksService],
})
export class TasksModule {}
