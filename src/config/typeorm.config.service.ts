import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    const dbUrl = this.configService.get<string>('DB_URL');
    const dbUser = this.configService.get<string>('DB_USER');
    const dbPassword = this.configService.get<string>('DB_PASSWORD');
    switch (process.env.NODE_ENV) {
      case 'development':
        return {
          type: 'postgres',
          url: dbUrl
            ?.replace('{user}', dbUser ?? '')
            .replace('{password}', dbPassword ?? ''),
          synchronize: true,
          autoLoadEntities: true,
          migrationsRun: false,
        };
      case 'test':
        return {
          type: 'postgres',
          url: dbUrl
            ?.replace('{user}', dbUser ?? '')
            .replace('{password}', dbPassword ?? ''),
          autoLoadEntities: true,
          synchronize: true,
          migrationsRun: false,
        };
      case 'production':
        return {
          type: 'postgres',
          url: dbUrl
            ?.replace('{user}', dbUser ?? '')
            .replace('{password}', dbPassword ?? ''),
          autoLoadEntities: true,
          synchronize: false,
          migrationsRun: false,
        };
      default:
        throw new Error(`Unknown environment: ${process.env.NODE_ENV}`);
    }
  }
}
