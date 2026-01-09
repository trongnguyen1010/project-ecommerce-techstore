import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user; // Lấy user từ Token (do JwtStrategy giải mã)

        // Kiểm tra xem có user không và role có phải ADMIN không
        if (user && user.role === 'ADMIN') {
        return true; // Cho qua
        }

        throw new ForbiddenException('Bạn không có quyền Admin!'); // Chặn lại
    }
}