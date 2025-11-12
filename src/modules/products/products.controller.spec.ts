import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductDto } from './dto/query-product.dto';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProductsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    remove: jest.fn(),
  };

  const mockProduct = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    sku: 'TEST-001',
    name: 'Test Product',
    brand: 'Test Brand',
    model: 'Model X',
    category: 'Electronics',
    color: 'Black',
    price: 199.99,
    currency: 'USD',
    stock: 50,
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z'),
  };

  const mockPaginatedResponse = {
    meta: {
      total: 1,
      skip: 0,
      limit: 5,
    },
    data: [mockProduct],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Controller Setup', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('should have access to ProductsService', () => {
      expect(service).toBeDefined();
    });
  });

  describe('POST /products', () => {
    it('should create a product', async () => {
      const createProductDto: CreateProductDto = {
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

      mockProductsService.create.mockResolvedValue(mockProduct);

      const result = await controller.create(createProductDto);

      expect(result).toBe(mockProduct);
    });

    it('should handle service errors', async () => {
      const createProductDto: CreateProductDto = {
        sku: 'DUPLICATE-SKU',
        name: 'Test Product',
        brand: 'Test Brand',
        model: 'Model X',
        category: 'Electronics',
        color: 'Black',
        price: 199.99,
        currency: 'USD',
        stock: 50,
      };

      const error = new Error('Product SKU already exists');
      mockProductsService.create.mockRejectedValue(error);

      await expect(controller.create(createProductDto)).rejects.toThrow(
        'Product SKU already exists',
      );
      expect(mockProductsService.create).toHaveBeenCalledWith(createProductDto);
    });
  });

  describe('GET /products', () => {
    it('should return paginated products with default query', async () => {
      mockProductsService.findAll.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findAll();

      expect(mockProductsService.findAll).toHaveBeenCalledWith(undefined);
      expect(mockProductsService.findAll).toHaveBeenCalledTimes(1);
      expect(result).toBe(mockPaginatedResponse);
    });

    it('should return paginated products with custom query', async () => {
      const query: QueryProductDto = {
        skip: 10,
        limit: 5,
        name: 'Test',
        category: 'Electronics',
        minPrice: 100,
        maxPrice: 500,
      };

      mockProductsService.findAll.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findAll(query);

      expect(mockProductsService.findAll).toHaveBeenCalledWith(query);
      expect(result).toBe(mockPaginatedResponse);
    });

    it('should return empty results when no products found', async () => {
      const emptyResponse = {
        meta: { total: 0, skip: 0, limit: 5 },
        data: [],
      };

      mockProductsService.findAll.mockResolvedValue(emptyResponse);

      const result = await controller.findAll();

      expect(result).toEqual(emptyResponse);
    });
  });

  describe('DELETE /products/:id', () => {
    it('should delete a product by id', async () => {
      const productId = '123e4567-e89b-12d3-a456-426614174000';
      const deleteResult = { affected: 1 };

      mockProductsService.remove.mockResolvedValue(deleteResult);

      const result = await controller.remove(productId);

      expect(mockProductsService.remove).toHaveBeenCalledWith(productId);
      expect(result).toBe(deleteResult);
    });

    it('should handle not found error when deleting non-existent product', async () => {
      const productId = 'non-existent-id';
      const error = new Error('Product not found or already deleted');

      mockProductsService.remove.mockRejectedValue(error);

      await expect(controller.remove(productId)).rejects.toThrow(
        'Product not found or already deleted',
      );
      expect(mockProductsService.remove).toHaveBeenCalledWith(productId);
    });
  });
});
