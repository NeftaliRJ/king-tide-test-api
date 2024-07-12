import { IsString, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  price: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  quantity: number;
}
