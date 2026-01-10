import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  // Lấy giỏ hàng của User
  async getCart(userId: number) {
    // Tìm giỏ hàng
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { 
        items: { 
          include: { product: true }, // Lấy thông tin SP (tên, ảnh, giá)
          orderBy: { createdAt: 'desc' }
        } 
      },
    });

    // Nếu chưa có thì tạo giỏ hàng rỗng ngay lập tức
    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
        include: { items: { include: { product: true } } },
      });
    }

    return cart;
  }

  // 2. Thêm sản phẩm vào giỏ
  async addToCart(userId: number, productId: number, quantity: number) {
    // Đảm bảo User đã có giỏ
    const cart = await this.getCart(userId);

    // Kiểm tra xem sản phẩm này đã có trong giỏ chưa
    const existingItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: productId,
      },
    });

    if (existingItem) {
      // Nếu có rồi -> Cộng dồn số lượng
      return this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      // Nếu chưa có -> Tạo mới
      return this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }
  }

  // 3. Cập nhật số lượng (Tăng/Giảm ở trang Cart)
  async updateQuantity(itemId: number, quantity: number) {
    if (quantity <= 0) {
      return this.remove(itemId); // Nếu giảm về 0 thì xóa luôn
    }
    return this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
  }

  // 4. Xóa 1 món khỏi giỏ
  async remove(itemId: number) {
    return this.prisma.cartItem.delete({
      where: { id: itemId },
    });
  }

  // 5. Xóa sạch giỏ hàng (Sau khi Checkout thành công)
  async clearCart(userId: number) {
    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (cart) {
      await this.prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }
  }
}