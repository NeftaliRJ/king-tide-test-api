import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';

@Injectable()
export class OrdersUseCase {
  constructor(private ordersService: OrdersService) {}

  async createOrder(data: CreateOrderDto) {
    return this.ordersService.create(data);
  }

  async findAll() {
    return this.ordersService.findAll();
  }

  async findOne(id: number) {
    return this.ordersService.findOne(id);
  }
}
