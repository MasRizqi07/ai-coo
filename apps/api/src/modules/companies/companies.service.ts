import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { UpdateCompanyDto } from '@ai-coo/shared-types';

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(companyId: string) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
      include: {
        _count: {
          select: {
            products: { where: { deletedAt: null } },
            customers: { where: { deletedAt: null } },
            sales: true,
            users: true,
          },
        },
      },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return company;
  }

  async updateProfile(companyId: string, dto: UpdateCompanyDto) {
    const updated = await this.prisma.company.update({
      where: { id: companyId },
      data: {
        ...(dto.name ? { name: dto.name } : {}),
        ...(dto.phone !== undefined ? { phone: dto.phone } : {}),
        ...(dto.address !== undefined ? { address: dto.address } : {}),
      },
    });

    return updated;
  }
}
