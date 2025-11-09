import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { ProductsModule } from '../modules/products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../config/typeorm.config.service';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { APP_PIPE } from '@nestjs/core';
import { ReportsModule } from 'src/modules/reports/reports.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    ProductsModule,
    ReportsModule,
    AuthModule,
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        `.env.${process.env.NODE_ENV}.local`,
        `.env.local`,
        `.env.${process.env.NODE_ENV}`,
        '.env',
      ],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        whitelist: true,
        stopAtFirstError: false,
      }),
    },
  ],
})
export class AppModule {}
