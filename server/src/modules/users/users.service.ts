import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  //CẬP NHẬT THÔNG TIN CƠ BẢN
  async updateProfile(userId: number, data: { fullName: string; phone: string }) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        fullName: data.fullName,
        phone: data.phone,
      },
    });
  }

  //ĐỔI MẬT KHẨU
  async changePassword(userId: number, oldPass: string, newPass: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new BadRequestException('User không tồn tại');

    // // Kiểm tra mật khẩu cũ
    const isMatch = await bcrypt.compare(oldPass, user.password);
    if (!isMatch) {
      throw new BadRequestException('Mật khẩu cũ không đúng');
    }

    // Mã hóa mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPass, 10);

    return this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }
}