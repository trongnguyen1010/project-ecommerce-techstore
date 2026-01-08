import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'Vui lòng nhập Email hoặc Số điện thoại' })
  @IsString()
  identifier: string; // Biến này sẽ chứa Email or Phone

  @IsNotEmpty({ message: 'Vui lòng nhập mật khẩu' })
  password: string;
}