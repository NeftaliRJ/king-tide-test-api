import { DatabaseService } from '@/shared/services/database.service';
import { Injectable } from '@nestjs/common';
import { Order } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OrdersRepository {
  constructor(private readonly database: DatabaseService) {}

  async createOrder(
    orderItemsData: {
      product: { connect: { id: number } };
      quantity: number;
    }[],
  ): Promise<Order> {
    return this.database.order.create({
      data: {
        uuid: uuidv4(),
        orderItems: {
          create: orderItemsData,
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async findAllOrders(): Promise<Order[]> {
    return this.database.order.findMany({
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async findOrderById(id: number): Promise<Order> {
    return this.database.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });
  }
}
