import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    return {
      type: 'postgres',
      host: this.configService.get('DB_HOST'),
      port: this.configService.get('DB_PORT'),
      username: this.configService.get('DB_USER'),
      password: this.configService.get('DB_PASSWORD'),
      database: this.configService.get('DB_NAME'),
      entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
      synchronize: this.configService.get('NODE_ENV') === 'development',
      logging: this.configService.get('DB_LOGGING'),
      migrations: [`${__dirname}/../db/migrations/*{.ts,.js}`],
      migrationsTableName: 'migrations',
    };
  }
}
