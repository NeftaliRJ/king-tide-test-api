import { DatabaseService } from '@/shared/services/database.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ProductModel } from '../entities/product.model';

@Injectable()
export class ProductsRepository {
  constructor(private readonly database: DatabaseService) {}

  async create(model: ProductModel): Promise<ProductModel> {
    const product = await this.database.product.create({
      data: model.getDataToCreate(),
    });

    model.setId(product.id);

    return model;
  }

  async findOneOrNull(
    params: Prisma.ProductWhereInput,
  ): Promise<ProductModel | null> {
    const product = await this.database.product.findFirst({
      where: params,
    });

    if (!product) {
      return null;
    }

    return new ProductModel(product);
  }

  async findMany(params: Prisma.ProductWhereInput): Promise<ProductModel[]> {
    const products = await this.database.product.findMany({
      where: params,
    });

    return products.map((product) => new ProductModel(product));
  }

  async update(
    params: Prisma.ProductWhereUniqueInput,
    data: Prisma.ProductUpdateInput,
  ): Promise<ProductModel> {
    const product = await this.database.product.update({
      where: params,
      data,
    });

    return new ProductModel(product);
  }

  async delete(params: Prisma.ProductWhereUniqueInput) {
    return this.database.product.delete({
      where: params,
    });
  }
}
