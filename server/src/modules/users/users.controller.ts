import { Controller, Body, Patch, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // API: PATCH /users/profile
  @Patch('profile')
  updateProfile(@Request() req, @Body() body: { fullName: string; phone: string }) {
    return this.usersService.updateProfile(req.user.userId, body);
  }

  // API: PATCH /users/password
  @Patch('password')
  changePassword(@Request() req, @Body() body: { oldPass: string; newPass: string }) {
    return this.usersService.changePassword(req.user.userId, body.oldPass, body.newPass);
  }
}