import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { OrdersRepository } from './orders.repository';
import { Observable, of } from 'rxjs';
import { Order } from '@prisma/client';
import { CreateOrderDto } from './dto/create-order.dto';

interface ProductService {
  checkProductAvailability(data: {
    productId: number;
    quantity: number;
  }): Observable<{ available: boolean }>;
}

describe('OrdersService', () => {
  let ordersService: OrdersService;
  let ordersRepository: OrdersRepository;
  let productService: ProductService;

  const mockOrdersRepository = {
    createOrder: jest.fn(),
    findAllOrders: jest.fn(),
    findOrderById: jest.fn(),
  };

  const mockProductService = {
    checkProductAvailability: jest.fn(),
  };

  const mockClientGrpc = {
    getService: () => mockProductService,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: OrdersRepository,
          useValue: mockOrdersRepository,
        },
        {
          provide: 'PRODUCT_PACKAGE',
          useValue: mockClientGrpc,
        },
      ],
    }).compile();

    ordersService = module.get<OrdersService>(OrdersService);
    ordersRepository = module.get<OrdersRepository>(OrdersRepository);
    productService = module.get<ProductService>('PRODUCT_PACKAGE');
  });

  it('should be defined', () => {
    expect(ordersService).toBeDefined();
  });

  describe('create', () => {
    it('should call productService.checkProductAvailability with correct parameters and create order if available', async () => {
      const createOrderDto: CreateOrderDto = {
        items: [{ productId: 1, quantity: 2 }],
      };
      mockProductService.checkProductAvailability.mockReturnValue(
        of({ available: true }),
      );
      mockOrdersRepository.createOrder.mockResolvedValue({
        id: 1,
        items: createOrderDto.items,
      } as Order);

      const result = await ordersService.create(createOrderDto);

      expect(productService.checkProductAvailability).toHaveBeenCalledWith({
        productId: 1,
        quantity: 2,
      });
      expect(ordersRepository.createOrder).toHaveBeenCalledWith([
        { product: { connect: { id: 1 } }, quantity: 2 },
      ]);
      expect(result).toEqual({ id: 1, items: createOrderDto.items });
    });

    it('should throw an error if product is not available', async () => {
      const createOrderDto: CreateOrderDto = {
        items: [{ productId: 1, quantity: 2 }],
      };
      mockProductService.checkProductAvailability.mockReturnValue(
        of({ available: false }),
      );

      await expect(ordersService.create(createOrderDto)).rejects.toThrowError(
        `Product 1 is not available in the requested quantity`,
      );
      expect(productService.checkProductAvailability).toHaveBeenCalledWith({
        productId: 1,
        quantity: 2,
      });
      expect(ordersRepository.createOrder).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should call ordersRepository.findAllOrders and return all orders', async () => {
      const orders = [{ id: 1 }, { id: 2 }] as Order[];
      mockOrdersRepository.findAllOrders.mockResolvedValue(orders);

      const result = await ordersService.findAll();

      expect(ordersRepository.findAllOrders).toHaveBeenCalled();
      expect(result).toEqual(orders);
    });
  });

  describe('findOne', () => {
    it('should call ordersRepository.findOrderById and return the order', async () => {
      const order = { id: 1 } as Order;
      mockOrdersRepository.findOrderById.mockResolvedValue(order);

      const result = await ordersService.findOne(1);

      expect(ordersRepository.findOrderById).toHaveBeenCalledWith(1);
      expect(result).toEqual(order);
    });
  });
});
