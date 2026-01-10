import { Controller, Get, Post, Body, UseGuards, Request, Patch, Param, Put } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // 1. API Tạo đơn hàng (Dùng cho Checkout)
  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  //API MỚI: Lấy lịch sử mua hàng
  @UseGuards(AuthGuard('jwt')) // Bắt buộc phải có Token mới vào được
  @Get('me')
  getMyOrders(@Request() req) {
    //req.user được tạo ra từ jwtstrategy
    const userId =  req.user.userId;
    return this.ordersService.findByUser(userId);
  }

  // API cho Admin  : xem all đơn hàng
  @UseGuards(AuthGuard('jwt'), RolesGuard) // phải có token + là admin
  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  //API cho Admin : cập nhật trạng thái đơn
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string){
    return this.ordersService.updateStatus(+id, status);
  }

  // Admin xem chi tiết đơn
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  // Admin cập nhật đơn (status + inf giao hàng)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Put(':id') // Dùng PUT để cập nhật nhiều trường
  update(@Param('id') id: string, @Body() body: any) {
    return this.ordersService.update(+id, body);
  }


}