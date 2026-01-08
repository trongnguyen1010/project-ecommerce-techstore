import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // <--- Quan trọng: Giúp module này dùng được toàn app
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // <--- Cho phép người khác dùng Service này
})
export class PrismaModule {}