import { IsOptional, IsString, IsNumber, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';

export class FindProductsDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  minPrice?: number;

  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  maxPrice?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  limit?: number = 50;

  @IsOptional()
  @IsIn(['name', 'price', 'quantity', 'createdAt'])
  @IsString()
  orderBy?: string;
}
