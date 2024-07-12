import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { ProductsRepository } from '../repository/products.repository';
import { ProductModel } from '../entities/product.model';
import { Prisma } from '@prisma/client';
import { CreateProductDto } from '../dto/create-product.dto';
import { FindProductsDto } from '../dto/find-product.dto';
import { BadRequestException } from '@nestjs/common';

describe('ProductsService', () => {
  let productsService: ProductsService;
  let productsRepository: ProductsRepository;

  const mockProductsRepository = {
    create: jest.fn(),
    findMany: jest.fn(),
    findOneOrNull: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: ProductsRepository,
          useValue: mockProductsRepository,
        },
      ],
    }).compile();

    productsService = module.get<ProductsService>(ProductsService);
    productsRepository = module.get<ProductsRepository>(ProductsRepository);
  });

  it('should be defined', () => {
    expect(productsService).toBeDefined();
  });

  describe('create', () => {
    it('should call productsRepository.create with correct parameters', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        quantity: 10,
      };
      const product = new ProductModel(createProductDto);
      mockProductsRepository.create.mockResolvedValue(undefined);

      await productsService.create(createProductDto);
      expect(productsRepository.create).toHaveBeenCalledWith(product);
    });
  });

  describe('findAll', () => {
    it('should call productsRepository.findMany with correct parameters', async () => {
      const findProductsDto: FindProductsDto = { limit: 10 };
      mockProductsRepository.findMany.mockResolvedValue([]);

      await productsService.findAll(findProductsDto);
      expect(productsRepository.findMany).toHaveBeenCalledWith(findProductsDto);
    });
  });

  describe('findOne', () => {
    it('should return product entity if product is found', async () => {
      const productId = 1;
      const product = new ProductModel({
        id: productId,
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        quantity: 10,
      });
      mockProductsRepository.findOneOrNull.mockResolvedValue(product);

      const result = await productsService.findOne(productId);
      expect(result).toEqual(product.getEntity());
    });

    it('should throw BadRequestException if product is not found', async () => {
      const productId = 1;
      mockProductsRepository.findOneOrNull.mockResolvedValue(null);

      await expect(productsService.findOne(productId)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('update', () => {
    it('should call productsRepository.update with correct parameters if product is found', async () => {
      const productId = 1;
      const updateData: Prisma.ProductUpdateInput = { name: 'Updated Product' };
      const product = new ProductModel({
        id: productId,
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        quantity: 10,
      });
      const updatedProduct = new ProductModel({
        id: productId,
        name: 'Updated Product',
        description: 'Updated Description',
        price: 150,
        quantity: 5,
      });

      mockProductsRepository.findOneOrNull.mockResolvedValue(product);
      mockProductsRepository.update.mockResolvedValue(updatedProduct);

      const result = await productsService.update(productId, updateData);
      expect(productsRepository.update).toHaveBeenCalledWith(
        { id: productId },
        updateData,
      );
      expect(result).toEqual(updatedProduct.getEntity());
    });

    it('should throw BadRequestException if product is not found', async () => {
      const productId = 1;
      const updateData: Prisma.ProductUpdateInput = { name: 'Updated Product' };
      mockProductsRepository.findOneOrNull.mockResolvedValue(null);

      await expect(
        productsService.update(productId, updateData),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should call productsRepository.delete with correct parameters if product is found', async () => {
      const productId = 1;
      const product = new ProductModel({
        id: productId,
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        quantity: 10,
      });

      mockProductsRepository.findOneOrNull.mockResolvedValue(product);
      mockProductsRepository.delete.mockResolvedValue(undefined);

      await productsService.remove(productId);
      expect(productsRepository.delete).toHaveBeenCalledWith({ id: productId });
    });

    it('should throw BadRequestException if product is not found', async () => {
      const productId = 1;
      mockProductsRepository.findOneOrNull.mockResolvedValue(null);

      await expect(productsService.remove(productId)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('checkProductAvailability', () => {
    it('should return availability status based on product quantity', async () => {
      const data = { productId: 1, quantity: 5 };
      const product = new ProductModel({
        id: data.productId,
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        quantity: 10,
      });

      mockProductsRepository.findOneOrNull.mockResolvedValue(product);

      const result = await productsService.checkProductAvailability(data);
      expect(result).toEqual({ available: true });

      product.setQuantity(3);
      mockProductsRepository.findOneOrNull.mockResolvedValue(product);

      const resultNotAvailable =
        await productsService.checkProductAvailability(data);
      expect(resultNotAvailable).toEqual({ available: false });
    });
  });
});
