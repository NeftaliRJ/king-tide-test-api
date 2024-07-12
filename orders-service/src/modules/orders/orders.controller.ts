import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersUseCase } from './orders.use-case';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersUseCase: OrdersUseCase) {}
  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersUseCase.createOrder(createOrderDto);
  }

  @Get()
  findAll() {
    return this.ordersUseCase.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersUseCase.findOne(Number(id));
  }
}
