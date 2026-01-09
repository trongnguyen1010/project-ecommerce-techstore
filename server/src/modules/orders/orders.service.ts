import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    const { items, userId, ...customerInfo } = createOrderDto;

    // Dùng $transaction: Tất cả thành công, hoặc tất cả thất bại (Rollback)
    return await this.prisma.$transaction(async (tx) => {
      
      // BƯỚC 1: Kiểm tra tồn kho trước
      for (const item of items) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        
        if (!product) {
          throw new BadRequestException(`Sản phẩm ID ${item.productId} không tồn tại`);
        }
        if (product.stock < item.quantity) {
          throw new BadRequestException(`Sản phẩm "${product.name}" không đủ hàng (Chỉ còn: ${product.stock})`);
        }
      }

      // BƯỚC 2: Tính tổng tiền
      const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

      // BƯỚC 3: Tạo Đơn hàng (Order) & Chi tiết đơn (OrderItems) cùng lúc
      const order = await tx.order.create({
        data: {
          ...customerInfo, // Gồm: fullName, phone, address
          userId: userId || null, 
          totalAmount: totalAmount,
          status: 'PENDING',
          
          // Prisma cho phép tạo luôn bảng con (OrderItem) lồng vào đây
          items: {
            create: items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: { items: true }, // Trả về kết quả kèm chi tiết để Frontend hiển thị
      });

      // BƯỚC 4: Trừ tồn kho (Stock)
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }, // Giảm số lượng đi
        });
      }

      return order;
    });
  }

  // Hàm lấy danh sách đơn (Để test)
  async findAll() {
    return this.prisma.order.findMany({
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  // Hàm lấy đơn hàng của 1 user cụ thể
  async findByUser(userId: number) {
    return this.prisma.order.findMany({
      where: { userId: userId }, // Chỉ lấy đơn có userId trùng khớp
      include: { 
        items: { 
          include: { product: true } // Lấy kèm chi tiết sản phẩm để hiển thị ảnh/tên
        } 
      },
      orderBy: { createdAt: 'desc' } // Đơn mới nhất lên đầu
    });
  }

  //Hàm cập nhật trạng thái đơn hàng
  async updateStatus(id : number, status: string) {
    return this.prisma.order.update({
      where: { id },
      data: {status},
    })
  }
}