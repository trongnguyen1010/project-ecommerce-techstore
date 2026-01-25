import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../../prisma/prisma.service'; // Import service vừa làm ở B1
// import { error } from 'console';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) { }

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

  // // Logic lấy all (Có thể lọc theo categoryId nếu muốn)
  // async findAll(categoryId? : number, search?: string) {
  //   return await this.prisma.product.findMany({
  //     where: {
  //       isDeleted: false,
  //       categoryId: categoryId ? categoryId : undefined ,
  //       name: search ? { contains: search, mode: 'insensitive' } : undefined,
  //     },
  //     include: { category: true }, // Lấy kèm tên danh mục
  //     orderBy: {createdAt: 'desc' } // sản phẩm mới trước
  //   });
  // }

  async findAll(
    categoryId?: number,
    search?: string,
    page: number = 1,
    limit: number = 12,
    minPrice?: number,
    maxPrice?: number,
    sort?: string
  ) {
    const skip = (page - 1) * limit; // Tính số lượng cần bỏ qua

    // Điều kiện lọc
    const where: any = {
      isDeleted: false,
      categoryId: categoryId ? categoryId : undefined,
      name: search ? { contains: search, mode: 'insensitive' } : undefined,
      price: {
        gte: minPrice, // >= minPrice
        lte: maxPrice, // <= maxPrice
      }
    };

    // Xử lý sort
    let orderBy: any = { createdAt: 'desc' }; // Default: Newest
    if (sort === 'price_asc') {
      orderBy = { price: 'asc' };
    } else if (sort === 'price_desc') {
      orderBy = { price: 'desc' };
    }

    // Dùng $transaction để chạy song song lấy data và Đếm tổng số
    const [data, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        include: { category: true },
        orderBy: orderBy,
        skip: skip,     // Bỏ qua
        take: limit,    //Lấy bao nhiêu
      }),
      this.prisma.product.count({ where }), // Đếm tổng thoả mãn điều kiện
    ]);

    return {
      data,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / limit),
      },
    };
  }

  // Logic lấy 1 cái
  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true }, // lay kem tt danh muc
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