import { Test, TestingModule } from '@nestjs/testing';
import { ProductUseCase } from './product.use-case';
import { ProductsService } from '../services/products.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { FindProductsDto } from '../dto/find-product.dto';

describe('ProductUseCase', () => {
  let productUseCase: ProductUseCase;
  let productsService: ProductsService;

  const mockProductsService = {
    create: jest.fn().mockResolvedValue({
      id: 1,
      name: 'Test Product',
      description: 'Test Description',
      price: 100,
      quantity: 10,
    }),
    findAll: jest.fn().mockResolvedValue([
      {
        id: 1,
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        quantity: 10,
      },
    ]),
    findOne: jest.fn().mockResolvedValue({
      id: 1,
      name: 'Test Product',
      description: 'Test Description',
      price: 100,
      quantity: 10,
    }),
    update: jest.fn().mockResolvedValue({
      id: 1,
      name: 'Updated Product',
      description: 'Updated Description',
      price: 150,
      quantity: 5,
    }),
    remove: jest.fn().mockResolvedValue({ id: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductUseCase,
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    productUseCase = module.get<ProductUseCase>(ProductUseCase);
    productsService = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(productUseCase).toBeDefined();
  });

  describe('createProduct', () => {
    it('should call productsService.create with correct parameters', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        quantity: 10,
      };
      await productUseCase.createProduct(createProductDto);
      expect(productsService.create).toHaveBeenCalledWith(createProductDto);
    });
  });

  describe('findAllProducts', () => {
    it('should call productsService.findAll with correct parameters', async () => {
      const findProductsDto: FindProductsDto = { limit: 10, offset: 0 };
      await productUseCase.findAllProducts(findProductsDto);
      expect(productsService.findAll).toHaveBeenCalledWith(findProductsDto);
    });
  });

  describe('findOneProduct', () => {
    it('should call productsService.findOne with correct parameters', async () => {
      const productId = 1;
      await productUseCase.findOneProduct(productId);
      expect(productsService.findOne).toHaveBeenCalledWith(productId);
    });
  });

  describe('updateProduct', () => {
    it('should call productsService.update with correct parameters', async () => {
      const productId = 1;
      const updateData = {
        name: 'Updated Product',
        description: 'Updated Description',
        price: 150,
        quantity: 5,
      };
      await productUseCase.updateProduct(productId, updateData);
      expect(productsService.update).toHaveBeenCalledWith(
        productId,
        updateData,
      );
    });
  });

  describe('removeProduct', () => {
    it('should call productsService.remove with correct parameters', async () => {
      const productId = 1;
      await productUseCase.removeProduct(productId);
      expect(productsService.remove).toHaveBeenCalledWith(productId);
    });
  });
});
