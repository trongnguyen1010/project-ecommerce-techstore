import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 1. Cho phép Frontend gọi API (QUAN TRỌNG)
  app.enableCors(); 

  // 2. Kích hoạt validation (để kiểm tra dữ liệu đầu vào)
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
