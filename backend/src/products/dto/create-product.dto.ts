import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;
  @IsOptional()
  @IsString()
  description?: string;
  @Type(() => Number)
  @IsNumber()
  price: number;
  @IsString()
  category: string;
  @IsOptional()
  @IsString()
  image?: string;
  @Type(() => Number)
  @IsNumber()
  stock: number;
}
