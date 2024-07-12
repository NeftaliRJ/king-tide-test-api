import { Injectable } from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { FindProductsDto } from '../dto/find-product.dto';

@Injectable()
export class ProductUseCase {
  constructor(private productsService: ProductsService) {}

  async createProduct(data: CreateProductDto) {
    return this.productsService.create(data);
  }

  async findAllProducts(params: FindProductsDto) {
    return this.productsService.findAll(params);
  }

  async findOneProduct(id: number) {
    return this.productsService.findOne(id);
  }

  async updateProduct(id: number, product) {
    return this.productsService.update(id, product);
  }

  async removeProduct(id: number) {
    return this.productsService.remove(id);
  }
}
