import { Test, TestingModule } from '@nestjs/testing';
import { ProductsRepository } from './products.repository';
import { DatabaseService } from '@/shared/services/database.service';
import { Prisma, Product } from '@prisma/client';
import { ProductModel } from '../entities/product.model';
import { FindProductsDto } from '../dto/find-product.dto';

describe('ProductsRepository', () => {
  let productsRepository: ProductsRepository;
  let databaseService: DatabaseService;

  const mockDatabaseService = {
    product: {
      create: jest.fn(),
      findFirst: jest.fn(),
      count: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsRepository,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    productsRepository = module.get<ProductsRepository>(ProductsRepository);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  it('should be defined', () => {
    expect(productsRepository).toBeDefined();
  });

  describe('create', () => {
    it('should call databaseService.product.create with correct parameters', async () => {
      const productData = {
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        quantity: 10,
      };
      const product = new ProductModel(productData);
      const createdProduct = { id: 1, ...productData };

      mockDatabaseService.product.create.mockResolvedValue(createdProduct);

      const result = await productsRepository.create(product);

      expect(databaseService.product.create).toHaveBeenCalledWith({
        data: product.getDataToCreate(),
      });
      expect(result.getId()).toBe(createdProduct.id);
    });
  });

  describe('findOneOrNull', () => {
    it('should return product model if product is found', async () => {
      const productId = 1;
      const productData = {
        id: productId,
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        quantity: 10,
      };
      mockDatabaseService.product.findFirst.mockResolvedValue(productData);

      const result = await productsRepository.findOneOrNull({ id: productId });

      expect(databaseService.product.findFirst).toHaveBeenCalledWith({
        where: { id: productId },
      });
      expect(result).toEqual(new ProductModel(productData));
    });

    it('should return null if product is not found', async () => {
      const productId = 1;
      mockDatabaseService.product.findFirst.mockResolvedValue(null);

      const result = await productsRepository.findOneOrNull({ id: productId });

      expect(databaseService.product.findFirst).toHaveBeenCalledWith({
        where: { id: productId },
      });
      expect(result).toBeNull();
    });
  });

  describe('findMany', () => {
    it('should return product data and total count', async () => {
      const findProductsDto: FindProductsDto = { name: 'Test', limit: 10 };
      const productData = [
        {
          id: 1,
          name: 'Test Product',
          description: 'Test Description',
          price: 100,
          quantity: 10,
        },
      ];
      const total = 1;

      mockDatabaseService.product.count.mockResolvedValue(total);
      mockDatabaseService.product.findMany.mockResolvedValue(productData);

      const result = await productsRepository.findMany(findProductsDto);

      expect(databaseService.product.count).toHaveBeenCalledWith({
        where: expect.any(Object),
      });
      expect(databaseService.product.findMany).toHaveBeenCalledWith({
        where: expect.any(Object),
        take: findProductsDto.limit ?? 50,
        orderBy: undefined,
      });
      expect(result).toEqual({ data: productData, total });
    });
  });

  describe('update', () => {
    it('should call databaseService.product.update with correct parameters', async () => {
      const productId = 1;
      const updateData: Prisma.ProductUpdateInput = { name: 'Updated Product' };
      const updatedProductData = {
        id: productId,
        name: 'Updated Product',
        description: 'Test Description',
        price: 100,
        quantity: 10,
      };

      mockDatabaseService.product.update.mockResolvedValue(updatedProductData);

      const result = await productsRepository.update(
        { id: productId },
        updateData,
      );

      expect(databaseService.product.update).toHaveBeenCalledWith({
        where: { id: productId },
        data: updateData,
      });
      expect(result).toEqual(new ProductModel(updatedProductData));
    });
  });

  describe('delete', () => {
    it('should call databaseService.product.delete with correct parameters', async () => {
      const productId = 1;

      mockDatabaseService.product.delete.mockResolvedValue(undefined);

      await productsRepository.delete({ id: productId });

      expect(databaseService.product.delete).toHaveBeenCalledWith({
        where: { id: productId },
      });
    });
  });
});
