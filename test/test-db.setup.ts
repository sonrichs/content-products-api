// CHECK THIS TOMORROW
import {
  StartedPostgreSqlContainer,
  PostgreSqlContainer,
} from '@testcontainers/postgresql';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Product } from '../src/modules/products/entities/product.entity';
import { User } from '../src/modules/users/entities/user.entity';

let container: StartedPostgreSqlContainer;

export const setupTestDatabase = async (): Promise<TypeOrmModuleOptions> => {
  console.log('Starting PostgreSQL test container...');

  container = await new PostgreSqlContainer('postgres:latest').start();

  console.log(
    `Test database started on ${container.getHost()}:${container.getPort()}`,
  );

  return {
    type: 'postgres',
    host: container.getHost(),
    port: container.getPort(),
    username: container.getUsername(),
    password: container.getPassword(),
    database: container.getDatabase(),
    entities: [Product, User],
    synchronize: true,
    dropSchema: true,
    logging: false,
  };
};

export const teardownTestDatabase = async (): Promise<void> => {
  if (container) {
    console.log('Stopping test container...');
    await container.stop();
    console.log('Test container stopped');
  }
};
