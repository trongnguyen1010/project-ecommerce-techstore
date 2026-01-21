import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { BannersService } from './banners.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard'; // Import đúng đường dẫn như file Product

@Controller() // Để trống route gốc để tự định nghĩa chi tiết bên dưới
export class BannersController {
  constructor(private readonly bannersService: BannersService) {}

  // PUBLIC: Lấy danh sách banner (Frontend gọi: GET /banners)
  @Get('banners')
  findAll() {
    return this.bannersService.findAll();
  }

  // ADMIN: Thêm banner (Frontend gọi: POST /admin/banners)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('admin/banners')
  create(@Body() createBannerDto: CreateBannerDto) {
    return this.bannersService.create(createBannerDto);
  }

  // ADMIN: Xóa banner (Frontend gọi: DELETE /admin/banners/:id)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete('admin/banners/:id')
  remove(@Param('id') id: string) {
    return this.bannersService.remove(+id); // Dấu + để ép kiểu string sang number
  }
}