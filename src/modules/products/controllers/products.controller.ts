import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ProductUseCase } from '../use-cases/product.use-case';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsUseCase: ProductUseCase) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsUseCase.createProduct(createProductDto);
  }

  @Get()
  findAll() {
    return this.productsUseCase.findAllProducts({});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsUseCase.findOneProduct(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsUseCase.updateProduct(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsUseCase.removeProduct(+id);
  }
}
