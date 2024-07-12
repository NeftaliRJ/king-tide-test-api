import { Module } from '@nestjs/common';
import { ProductsService } from './services/products.service';
import { ProductsController } from './controllers/products.controller';
import { ProductsRepository } from './repository/products.repository';
import { ProductUseCase } from './use-cases/product.use-case';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, ProductsRepository, ProductUseCase],
})
export class ProductsModule {}
