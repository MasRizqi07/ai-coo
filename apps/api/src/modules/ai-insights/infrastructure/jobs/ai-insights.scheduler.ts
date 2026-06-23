import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class AiInsightsScheduler implements OnApplicationBootstrap {
  private readonly logger = new Logger(AiInsightsScheduler.name);

  constructor(
    @InjectQueue('ai-insights')
    private readonly insightsQueue: Queue,
  ) {}

  async onApplicationBootstrap() {
    this.logger.log('Registering daily repeatable job for AI Insights...');

    // Clear old versions of this job to prevent conflicts on application reload
    const repeatableJobs = await this.insightsQueue.getRepeatableJobs();
    for (const job of repeatableJobs) {
      if (job.name === 'generate-all-insights') {
        await this.insightsQueue.removeRepeatableByKey(job.key);
      }
    }

    // Repeat at 06:00 WIB daily (tz: 'Asia/Jakarta')
    await this.insightsQueue.add(
      'generate-all-insights',
      {},
      {
        repeat: {
          pattern: '0 6 * * *',
          tz: 'Asia/Jakarta',
        },
      },
    );

    this.logger.log('Daily repeatable job successfully registered (06:00 WIB).');
  }
}
