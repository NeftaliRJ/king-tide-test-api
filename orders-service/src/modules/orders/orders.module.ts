import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrdersUseCase } from './orders.use-case';
import { OrdersRepository } from './orders.repository';
import { GrpcModule } from '../grpc/grpc.module';

@Module({
  imports: [GrpcModule],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersUseCase, OrdersRepository],
})
export class OrdersModule {}
