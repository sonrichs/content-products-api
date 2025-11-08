import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { ProductsModule } from '../modules/products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../config/typeorm.config.service';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [
    ProductsModule,
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
        transformOptions: {
          enableImplicitConversion: true,
        },
        whitelist: true,
        stopAtFirstError: false,
      }),
    },
  ],
})
export class AppModule {}
