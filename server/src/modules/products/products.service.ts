import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../../prisma/prisma.service'; // Import service vừa làm ở B1
// import { error } from 'console';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // Logic Thêm mới
  async create(createProductDto: CreateProductDto) {
    return await this.prisma.product.create({
      data: {
        name: createProductDto.name,
        price: createProductDto.price,
        description: createProductDto.description,
        stock: createProductDto.stock,
        categoryId: createProductDto.categoryId,
        images: createProductDto.images || [],
      },
    });
  }

  // Logic lấy all (Có thể lọc theo categoryId nếu muốn)
  async findAll(categoryId? : number, search?: string) {
    return await this.prisma.product.findMany({
      where: {
        isDeleted: false,
        categoryId: categoryId ? categoryId : undefined ,
        name: search ? { contains: search, mode: 'insensitive' } : undefined,
      },
      include: { category: true }, // Lấy kèm tên danh mục
      orderBy: {createdAt: 'desc' } // sản phẩm mới trước
    });
  }

  // Logic lấy 1 cái
  async findOne(id: number) { 
    const product = await this.prisma.product.findUnique({
      where : { id },
      include : { category: true }, // lay kem tt danh muc
    });
    // console.log(`Đang tìm sản phẩm ID: ${id}`);
    // neu ko tim thay throw error (optional)
    if (!product) {
      throw new NotFoundException(`Không tìm thấy sản phẩm có ID ${id}`);
    }
    return product;
  }

  // Logic update
  async update(id: number, updateProductDto: UpdateProductDto) {
    // Kiểm tra tồn tại trước
    await this.findOne(id);
    
    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    }); 
  }

  //Logic xóa, thay vì delete -> update isDeleted = true
  async remove(id: number) {
    await this.findOne(id); 
    return this.prisma.product.update({
      where: { id },
      data: { isDeleted: true }, // Đánh dấu là đã xóa
    }); 
  }
}