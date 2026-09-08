import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { GenerateInsightsUseCase } from '../../application/use-cases/generate-insights.use-case';
import { PrismaService } from '../../../../common/prisma/prisma.service';

@Processor('ai-insights')
export class AiInsightsProcessor extends WorkerHost {
  private readonly logger = new Logger(AiInsightsProcessor.name);

  constructor(
    private readonly generateInsightsUseCase: GenerateInsightsUseCase,
    private readonly prisma: PrismaService,
  ) {
    super();
  }

  async process(job: Job<unknown, unknown, string>): Promise<void> {
    if (job.name === 'generate-all-insights') {
      this.logger.log('Starting daily AI Insights pipeline for all companies...');
      const companies = await this.prisma.company.findMany();

      for (const company of companies) {
        try {
          this.logger.log(`Generating insight for company: ${company.name} (${company.id})`);
          await this.generateInsightsUseCase.execute(company.id);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          this.logger.error(
            `Failed to generate insights for company ${company.id}: ${errorMessage}`,
          );
        }
      }

      this.logger.log('Daily AI Insights pipeline completed.');
    }
  }
}
