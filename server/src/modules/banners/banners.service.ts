import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBannerDto } from './dto/create-banner.dto';

@Injectable()
export class BannersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBannerDto: CreateBannerDto) {
    // Map DTO sang tên cột trong DB (nếu cần)
    return this.prisma.banner.create({
      data: {
        title: createBannerDto.title,
        description: createBannerDto.description,
        imageUrl: createBannerDto.imageUrl,
        link: createBannerDto.link,
      },
    });
  }

  async findAll() {
    return this.prisma.banner.findMany({
      orderBy: {
        createdAt: 'desc', // Banner mới nhất lên đầu
      },
    });
  }

  async remove(id: number) {
    return this.prisma.banner.delete({
      where: { id },
    });
  }
}