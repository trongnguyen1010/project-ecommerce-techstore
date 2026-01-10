import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  // API TẠO MỚI (Chỉ Admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  create(@Body('name') name: string) {
    return this.categoriesService.create(name);
  }
}