import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../../prisma/prisma.service'; // Import service vừa làm ở B1
import { error } from 'console';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    return await this.prisma.product.create({
      data: {
        name: createProductDto.name,
        price: createProductDto.price,
        description: createProductDto.description,
        stock: createProductDto.stock,
        categoryId: createProductDto.categoryId,
      },
    });
  }

  async findAll() {
    return await this.prisma.product.findMany({
      include: { category: true }, // Lấy kèm luôn thông tin Category
    });
  }

  async findOne(id: number) { 
    const product = await this.prisma.product.findUnique({
      where : { id },
      include : { category: true }, // lay kem tt danh muc
    });
    console.log(`Đang tìm sản phẩm ID: ${id}`);
    // neu ko tim thay throw error (optional)
    if (!product) {
      throw new error(`Không tìm thấy sản phẩm có ID ${id}`);
    }
    return product;
  }
  update(id: number, updateProductDto: UpdateProductDto) { return `This action updates a #${id} product`; }
  remove(id: number) { return `This action removes a #${id} product`; }
}