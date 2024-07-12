import { Injectable } from '@nestjs/common';
import { ProductsService } from '../services/products.service';

@Injectable()
export class ProductUseCase {
  constructor(private productsService: ProductsService) {}

  async createProduct(data) {
    return this.productsService.create(data);
  }

  async findAllProducts(params) {
    return this.productsService.findAll(params);
  }

  async findOneProduct(id) {
    return this.productsService.findOne(id);
  }

  async updateProduct(id, product) {
    const productFound = await this.productsService.findOne(id);
    if (!productFound) {
      throw new Error('Product not found');
    }
    return this.productsService.update(product);
  }

  async removeProduct(id) {
    return this.productsService.remove(id);
  }
}
