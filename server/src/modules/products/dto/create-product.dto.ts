import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  stock: number;

  @IsNumber()
  categoryId: number; // Quan trọng: Sản phẩm phải thuộc về 1 danh mục

  @IsOptional()
  @IsArray()
  images?: string[]; // Mảng các link ảnh (URL text)
}