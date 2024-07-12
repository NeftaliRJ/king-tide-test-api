import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersUseCase } from './orders.use-case';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from '@prisma/client';

describe('OrdersController', () => {
  let ordersController: OrdersController;
  let ordersUseCase: OrdersUseCase;

  const mockOrdersUseCase = {
    createOrder: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersUseCase,
          useValue: mockOrdersUseCase,
        },
      ],
    }).compile();

    ordersController = module.get<OrdersController>(OrdersController);
    ordersUseCase = module.get<OrdersUseCase>(OrdersUseCase);
  });

  it('should be defined', () => {
    expect(ordersController).toBeDefined();
  });

  describe('create', () => {
    it('should call ordersUseCase.createOrder with correct parameters', async () => {
      const createOrderDto: CreateOrderDto = {
        items: [{ productId: 1, quantity: 2 }],
      };
      const result = { id: 1, items: createOrderDto.items } as Order;

      mockOrdersUseCase.createOrder.mockResolvedValue(result);

      const response = await ordersController.create(createOrderDto);

      expect(ordersUseCase.createOrder).toHaveBeenCalledWith(createOrderDto);
      expect(response).toEqual(result);
    });
  });

  describe('findAll', () => {
    it('should call ordersUseCase.findAll and return all orders', async () => {
      const result = [{ id: 1 }, { id: 2 }] as Order[];

      mockOrdersUseCase.findAll.mockResolvedValue(result);

      const response = await ordersController.findAll();

      expect(ordersUseCase.findAll).toHaveBeenCalled();
      expect(response).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should call ordersUseCase.findOne with correct parameters and return the order', async () => {
      const result = { id: 1 } as Order;

      mockOrdersUseCase.findOne.mockResolvedValue(result);

      const response = await ordersController.findOne('1');

      expect(ordersUseCase.findOne).toHaveBeenCalledWith(1);
      expect(response).toEqual(result);
    });
  });
});
