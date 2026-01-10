import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [CartController],
  providers: [CartService, PrismaService],
  exports: [CartService], // Export để module khác (như Order) có thể dùng nếu cần
})
export class CartModule {}