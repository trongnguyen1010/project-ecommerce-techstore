import { Controller, Get, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard) // Chỉ Admin mới được xem doanh thu
  @Get()
  getStats() {
    return this.statsService.getDashboardStats();
  }
}