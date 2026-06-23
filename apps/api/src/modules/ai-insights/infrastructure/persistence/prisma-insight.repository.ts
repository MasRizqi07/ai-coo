import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../common/prisma/prisma.service';
import { IInsightRepository } from '../../domain/repositories/insight.repository.interface';

@Injectable()
export class PrismaInsightRepository implements IInsightRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(companyId: string, payload: any, type: string): Promise<void> {
    await this.prisma.insight.create({
      data: {
        companyId,
        type: type as any,
        content: payload,
      },
    });
  }

  async findLatest(companyId: string): Promise<any | null> {
    const record = await this.prisma.insight.findFirst({
      where: { companyId },
      orderBy: { generatedAt: 'desc' },
    });
    return record ? record.content : null;
  }
}
