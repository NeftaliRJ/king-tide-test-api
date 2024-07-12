import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ProductUseCase } from '../use-cases/product.use-case';
import { FindProductsDto } from '../dto/find-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsUseCase: ProductUseCase) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    const product = await this.productsUseCase.createProduct(createProductDto);
    return {
      data: product,
    };
  }

  @Get()
  findAll(@Query() query: FindProductsDto) {
    return this.productsUseCase.findAllProducts(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const product = await this.productsUseCase.findOneProduct(+id);
    return {
      data: product,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const product = await this.productsUseCase.updateProduct(
      +id,
      updateProductDto,
    );
    return {
      data: product,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const product = await this.productsUseCase.removeProduct(+id);
    return {
      data: product,
    };
  }
}
