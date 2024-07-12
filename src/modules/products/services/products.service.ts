import { Injectable } from '@nestjs/common';
import { ProductsRepository } from '../repository/products.repository';
import { ProductModel } from '../entities/product.model';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private productsRepository: ProductsRepository) {}

  create(data: ProductModel) {
    return this.productsRepository.create(data);
  }

  findAll(params: Prisma.ProductWhereInput) {
    return this.productsRepository.findMany(params);
  }

  findOne(id: number) {
    return this.productsRepository.findOneOrNull({ id });
  }

  update(product: ProductModel) {
    const id = product.getId();
    const data = product.getEntity();
    return this.productsRepository.update({ id }, data);
  }

  remove(id: number) {
    return this.productsRepository.delete({ id });
  }
}
