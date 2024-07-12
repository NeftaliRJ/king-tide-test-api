import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom, Observable } from 'rxjs';
import { Order } from '@prisma/client';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersRepository } from './orders.repository';

interface ProductService {
  checkProductAvailability(data: {
    productId: number;
    quantity: number;
  }): Observable<{ available: boolean }>;
}

@Injectable()
export class OrdersService implements OnModuleInit {
  private productService: ProductService;

  constructor(
    @Inject('PRODUCT_PACKAGE') private client: ClientGrpc,
    private ordersRepository: OrdersRepository,
  ) {}

  onModuleInit() {
    this.productService =
      this.client.getService<ProductService>('ProductService');
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { items } = createOrderDto;
    for (const item of items) {
      const response = await lastValueFrom(
        this.productService.checkProductAvailability({
          productId: item.productId,
          quantity: item.quantity,
        }),
      );
      if (!response.available) {
        throw new Error(
          `Product ${item.productId} is not available in the requested quantity`,
        );
      }
    }

    const orderItemsData = items.map((item) => ({
      product: { connect: { id: item.productId } },
      quantity: item.quantity,
    }));

    return this.ordersRepository.createOrder(orderItemsData);
  }

  async findAll(): Promise<Order[]> {
    return this.ordersRepository.findAllOrders();
  }

  async findOne(id: number): Promise<Order> {
    return this.ordersRepository.findOrderById(id);
  }
}
