import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../../prisma/prisma.module'; 
import { JwtModule } from '@nestjs/jwt'; 

@Module({
  imports: [
    PrismaModule, // Để dùng được PrismaService
    
    // 2. CẤU HÌNH JWT MODULE (Đây là đoạn bạn đang thiếu)
    JwtModule.register({
      global: true, 
      secret: 'SECRET_KEY_NAY_PHAI_BAO_MAT', // Sau này nên để trong file .env
      signOptions: { expiresIn: '1d' }, // Token sống được 1 ngày
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}