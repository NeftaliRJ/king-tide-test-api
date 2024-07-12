import { Product, Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { ProductWithRelations } from '../interfaces';

export class ProductModel {
  private entity: Product;
  private relationsToCreate: Partial<Prisma.ProductCreateInput>;

  constructor(data: Partial<ProductWithRelations> = {}) {
    this.setEntity(data as Product);
  }

  public setRelationsToCreate(data: Partial<Prisma.ProductCreateInput>) {
    this.relationsToCreate = data;
  }

  public getDataToCreate() {
    return {
      ...this.entity,
      ...this.relationsToCreate,
    };
  }

  setId(id: number) {
    this.entity.id = id;
  }

  getId() {
    return this.entity.id;
  }

  public setEntity(data: Product) {
    this.entity = {
      uuid: uuidv4(),
      ...data,
    };
  }

  public getEntity() {
    return this.entity;
  }

  public getUuid() {
    return this.entity.uuid;
  }
}
