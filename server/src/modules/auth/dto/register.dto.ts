import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsOptional()
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email?: string;

  @IsOptional()
  @IsString()
  // @Matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, {message: 'SĐT không đúng định dạng VN'}) -> Sau này có thể thêm Regex validate SĐT
  phone?: string;

  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  password: string;

  @IsNotEmpty({ message: 'Họ tên không được để trống' })
  fullName: string;
}