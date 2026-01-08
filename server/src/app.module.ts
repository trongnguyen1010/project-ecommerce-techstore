import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [PrismaModule, ProductsModule, OrdersModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
