import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app/app.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { setupTestDatabase, teardownTestDatabase } from '../test-db.setup';
import { ProductDto } from '../../src/modules/products/dto/product.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let dbConfig: TypeOrmModuleOptions;

  beforeAll(async () => {
    // Setup test database container
    dbConfig = await setupTestDatabase();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [],
    })
      .overrideModule(TypeOrmModule)
      .useModule(TypeOrmModule.forRoot(dbConfig))
      .compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        stopAtFirstError: false,
      }),
    );

    app.enableVersioning({
      type: VersioningType.URI,
    });
    app.setGlobalPrefix('api');

    await app.init();
  });

  afterEach(async () => {
    // Close app after each test to avoid connection leaks
    if (app) {
      await app.close();
    }
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  it('/api/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/health')
      .expect(200)
      .expect('OK');
  });

  describe('Products API', () => {
    it('should create a product', async () => {
      const productData = {
        sku: 'TEST-001',
        name: 'Test Product',
        brand: 'Test Brand',
        model: 'Model X',
        category: 'Electronics',
        color: 'Black',
        price: 199.99,
        currency: 'USD',
        stock: 50,
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/products')
        .send(productData)
        .expect(201);

      expect(response.body).toMatchObject(ProductDto);
      expect((response.body as ProductDto).id).toBeDefined();
    });

    it('should get paginated products', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/products')
        .expect(200);

      expect(response.body).toHaveProperty('meta');
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });
});
