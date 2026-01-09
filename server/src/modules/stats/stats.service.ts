import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    // 1. Tổng doanh thu (Chỉ tính các đơn đã hoàn thành hoặc đã ship)
    const revenue = await this.prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { status: { not: 'CANCELLED' } } // Không tính đơn hủy
    });

    // 2. Tổng số đơn hàng
    const totalOrders = await this.prisma.order.count();

    // 3. Tổng số khách hàng (Trừ Admin ra)
    const totalUsers = await this.prisma.user.count({
      where: { role: 'USER' }
    });

    // 4. Tổng số sản phẩm
    const totalProducts = await this.prisma.product.count({
      where: { isDeleted: false }
    });

    // 5. Lấy 5 đơn hàng mới nhất
    const recentOrders = await this.prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { fullName: true } } }
    });

    return {
      revenue: revenue._sum.totalAmount || 0,
      totalOrders,
      totalUsers,
      totalProducts,
      recentOrders
    };
  }
}