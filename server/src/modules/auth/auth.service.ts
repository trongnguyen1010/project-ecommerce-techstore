import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // 1. ĐĂNG KÝ (Nâng cấp)
  async register(registerDto: RegisterDto) {
  const { email, phone, password, fullName } = registerDto;

  // 1. Validate: phải có ít nhất email hoặc phone
  if (!email && !phone) {
    throw new BadRequestException(
      'Bạn phải cung cấp Email hoặc Số điện thoại!',
    );
  }

  // 2. Check trùng
  const existingUser = await this.prisma.user.findFirst({
    where: {
      OR: [
        ...(email ? [{ email }] : []),
        ...(phone ? [{ phone }] : []),
      ],
    },
  });

  if (existingUser) {
    throw new BadRequestException(
      'Email hoặc Số điện thoại này đã được sử dụng!',
    );
  }

  // 3. Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // // 4. Create user (BUILD DATA ĐỘNG)
  // const user = await this.prisma.user.create({
  //   data: {
  //     ...(email && { email }),
  //     ...(phone && { phone }),
  //     password: hashedPassword,
  //     fullName,
  //     role: 'USER',
  //   },
  // });
  const data: Prisma.UserCreateInput = {
    password: hashedPassword,
    fullName,
    role: 'USER',
    };

    if (email) { data.email = email;}

    if (phone) { data.phone = phone; }

    const user = await this.prisma.user.create({ data });

  return {
    message: 'Đăng ký thành công',
    userId: user.id,
  };
}

  // 2. ĐĂNG NHẬP (Nâng cấp)
  async login(loginDto: LoginDto) {
    const { identifier, password } = loginDto;

    // Tìm user khớp với Email HOẶC Phone
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier }, // Tìm cột email
          { phone: identifier }, // Tìm cột phone
        ],
      },
    });

    if (!user) {
      throw new UnauthorizedException('Tài khoản hoặc mật khẩu không đúng');
    }

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Tài khoản hoặc mật khẩu không đúng');
    }

    // Tạo Token
    const payload = { sub: user.id, email: user.email, phone: user.phone, role: user.role };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      message: 'Đăng nhập thành công',
      accessToken,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    };
  }
}