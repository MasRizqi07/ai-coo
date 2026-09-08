import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { HealthModule } from './modules/health/health.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { CustomersModule } from './modules/customers/customers.module';
import { ProductsModule } from './modules/products/products.module';
import { SalesModule } from './modules/sales/sales.module';
import { AiInsightsModule } from './modules/ai-insights/ai-insights.module';
import { CompaniesModule } from './modules/companies/companies.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../.env'],
    }),

    // BullMQ / Redis
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST') || '127.0.0.1',
          port: Number(configService.get('REDIS_PORT')) || 6379,
          maxRetriesPerRequest: null,
          enableOfflineQueue: false,
          retryStrategy: (times: number) => {
            // Exponential backoff when Redis is unavailable to prevent endless aggressive terminal spam
            if (times > 3) {
              return 30000;
            }
            return Math.min(times * 1000, 5000);
          },
        },
      }),
    }),

    // Prisma module
    PrismaModule,

    // Feature modules
    AuthModule,
    DashboardModule,
    CustomersModule,
    ProductsModule,
    SalesModule,
    AiInsightsModule,
    CompaniesModule,

    // Health check module
    HealthModule,
  ],
})
export class AppModule {}
