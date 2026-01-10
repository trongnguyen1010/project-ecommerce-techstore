import { Controller, Post, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @UseInterceptors(FileInterceptor('file')) // 'file' là tên key khi gửi từ Frontend
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const url = await this.uploadService.uploadImage(file);
    return { url }; // Trả về dạng JSON { "url": "..." }
  }
}