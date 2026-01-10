import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  
  // THÊM SẢN PHẨM (Chỉ Admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll(
    @Query('category') categoryId?: string,
    @Query('search') search?: string,
    @Query('page') page?: string, 
  ) {
    return this.productsService.findAll(
      categoryId ? +categoryId : undefined,
      search,
      page ? +page : 1, // Truyền vào service (Mặc định trang 1)
      20 // default 20/page
    );
  }

  // XEM CHI TIẾT (Ai cũng xem được)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  // CẬP NHẬT SẢN PHẨM (Chỉ Admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  // XÓA SẢN PHẨM (Chỉ Admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
