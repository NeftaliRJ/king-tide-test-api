import { Injectable } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { Order } from '@prisma/client';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private ordersRepository: OrdersRepository) {}
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { items } = createOrderDto;
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
