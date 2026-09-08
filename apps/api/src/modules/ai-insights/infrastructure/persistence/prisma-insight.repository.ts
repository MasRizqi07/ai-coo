import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../common/prisma/prisma.service';
import { IInsightRepository } from '../../domain/repositories/insight.repository.interface';
import { InsightPayload } from '../../application/use-cases/generate-insights.use-case';
import { InsightType } from '@ai-coo/database';

@Injectable()
export class PrismaInsightRepository implements IInsightRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(companyId: string, payload: InsightPayload, type: string): Promise<void> {
    await this.prisma.insight.create({
      data: {
        companyId,
        type: type as InsightType,
        content: payload,
      },
    });
  }

  async findLatest(companyId: string): Promise<InsightPayload | null> {
    const record = await this.prisma.insight.findFirst({
      where: { companyId },
      orderBy: { generatedAt: 'desc' },
    });
    return record ? (record.content as unknown as InsightPayload) : null;
  }
}
