import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    // Load .env from monorepo root
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../.env'],
    }),

    // Health check module
    HealthModule,
  ],
})
export class AppModule {}
