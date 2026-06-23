import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ProductsModule } from '../products/products.module';
import { CustomersModule } from '../customers/customers.module';
import { SalesModule } from '../sales/sales.module';
import { AiInsightsController } from './presentation/controllers/ai-insights.controller';
import { GenerateInsightsUseCase } from './application/use-cases/generate-insights.use-case';
import { AnalyticsService } from './application/services/analytics.service';
import { AiInsightsProcessor } from './infrastructure/jobs/ai-insights.processor';
import { AiInsightsScheduler } from './infrastructure/jobs/ai-insights.scheduler';
import { AI_PROVIDER } from './domain/services/ai-provider.interface';
import { OpenAiProvider } from './infrastructure/services/openai-provider.service';
import { INSIGHT_REPOSITORY } from './domain/repositories/insight.repository.interface';
import { PrismaInsightRepository } from './infrastructure/persistence/prisma-insight.repository';

@Module({
  imports: [
    ProductsModule,
    CustomersModule,
    SalesModule,
    BullModule.registerQueue({
      name: 'ai-insights',
    }),
  ],
  controllers: [AiInsightsController],
  providers: [
    GenerateInsightsUseCase,
    AnalyticsService,
    AiInsightsProcessor,
    AiInsightsScheduler,
    {
      provide: AI_PROVIDER,
      useClass: OpenAiProvider,
    },
    {
      provide: INSIGHT_REPOSITORY,
      useClass: PrismaInsightRepository,
    },
  ],
  exports: [GenerateInsightsUseCase],
})
export class AiInsightsModule {}
