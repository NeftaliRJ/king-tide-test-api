import { DatabaseService } from '@/shared/services/database.service';
import { Injectable } from '@nestjs/common';
import { Prisma, Product } from '@prisma/client';
import { ProductModel } from '../entities/product.model';
import { FindProductsDto } from '../dto/find-product.dto';

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

  async findMany(
    query: FindProductsDto,
  ): Promise<{ data: Product[]; total: number }> {
    const { name, description, minPrice, maxPrice, limit, orderBy } = query;

    const where = {
      name: name ? { contains: name } : undefined,
      description: description ? { contains: description } : undefined,
      price: {
        gte: minPrice ?? undefined,
        lte: maxPrice ?? undefined,
      },
    };

    const [total, data] = await Promise.all([
      this.database.product.count({ where }),
      this.database.product.findMany({
        where,
        take: limit ?? 50,
        orderBy: orderBy ? { [orderBy]: 'asc' } : undefined,
      }),
    ]);

    return { data, total };
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
