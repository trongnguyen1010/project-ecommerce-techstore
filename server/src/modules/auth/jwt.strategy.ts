import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
        // Lấy token từ Header: Authorization: Bearer <token>
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        // Key bí mật (Phải trùng với key bên AuthModule)
        secretOrKey: 'SECRET_KEY_NAY_PHAI_BAO_MAT', 
    });
  }

  // Khi Token hợp lệ, hàm này sẽ chạy và trả về thông tin user
  async validate(payload: any) {
    // payload.sub chính là userId (quy định lúc login)
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}