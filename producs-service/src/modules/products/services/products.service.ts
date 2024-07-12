import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductsRepository } from '../repository/products.repository';
import { ProductModel } from '../entities/product.model';
import { Prisma } from '@prisma/client';
import { CreateProductDto } from '../dto/create-product.dto';
import { FindProductsDto } from '../dto/find-product.dto';
import { GrpcMethod } from '@nestjs/microservices';

@Injectable()
export class ProductsService {
  constructor(private productsRepository: ProductsRepository) {}

  async create(data: CreateProductDto) {
    const product = new ProductModel(data);
    await this.productsRepository.create(product);

    return product.getEntity();
  }

  findAll(params: FindProductsDto) {
    return this.productsRepository.findMany(params);
  }

  async findOne(id: number) {
    const product = await this.productsRepository.findOneOrNull({ id });

    if (!product) {
      throw new BadRequestException('Product not found');
    }

    return product.getEntity();
  }

  async update(id: number, data: Prisma.ProductUpdateInput) {
    const productFound = await this.productsRepository.findOneOrNull({ id });
    if (!productFound) {
      throw new BadRequestException('Product not found');
    }

    const newProduct = await this.productsRepository.update(
      { id: productFound.getId() },
      data,
    );

    return newProduct.getEntity();
  }

  async remove(id: number) {
    const productFound = await this.productsRepository.findOneOrNull({ id });
    if (!productFound) {
      throw new BadRequestException('Product not found');
    }

    return this.productsRepository.delete({ id });
  }

  @GrpcMethod('ProductService', 'CheckProductAvailability')
  async checkProductAvailability(data: {
    productId: number;
    quantity: number;
  }): Promise<{ available: boolean }> {
    const product = await this.productsRepository.findOneOrNull({
      id: data?.productId,
    });

    const entityProduct = product?.getEntity();

    return {
      available: entityProduct && entityProduct.quantity >= data.quantity,
    };
  }
}
