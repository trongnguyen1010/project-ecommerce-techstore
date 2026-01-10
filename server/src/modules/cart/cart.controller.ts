import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt')) // Bắt buộc phải đăng nhập mới dùng được Cart DB
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@Request() req) {
    return this.cartService.getCart(req.user.userId);
  }

  @Post()
  addToCart(@Request() req, @Body() body: { productId: number; quantity: number }) {
    return this.cartService.addToCart(req.user.userId, body.productId, body.quantity);
  }

  @Patch(':itemId')
  updateQuantity(@Param('itemId') itemId: string, @Body('quantity') quantity: number) {
    return this.cartService.updateQuantity(+itemId, quantity);
  }

  @Delete(':itemId')
  remove(@Param('itemId') itemId: string) {
    return this.cartService.remove(+itemId);
  }
}