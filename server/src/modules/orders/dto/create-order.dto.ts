import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested, Min } from 'class-validator';

// 1. Định nghĩa kỹ 1 món hàng trong giỏ gồm những gì
class OrderItemDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  @Min(1) // Số lượng ít nhất là 1
  quantity: number;

  @IsNumber()
  @Min(0) // Giá không được âm
  price: number;
}

// 2. Định nghĩa cả cái Đơn hàng
export class CreateOrderDto {
  @IsString()
  @IsNotEmpty() // Không được để trống
  fullName: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsOptional()
  @IsNumber()
  userId?: number; // Có thể null (nếu là khách vãng lai)

  @IsArray()
  @ValidateNested({ each: true }) // Kiểm tra kỹ từng món hàng bên trong mảng
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}