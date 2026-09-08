import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class AiInsightsScheduler implements OnApplicationBootstrap {
  private readonly logger = new Logger(AiInsightsScheduler.name);
  private hasLoggedRedisWarning = false;

  constructor(
    @InjectQueue('ai-insights')
    private readonly insightsQueue: Queue,
  ) {
    this.insightsQueue.on('error', (err) => {
      if (!this.hasLoggedRedisWarning) {
        this.hasLoggedRedisWarning = true;
        const msg = err instanceof Error ? err.message : String(err || 'Connection refused');
        this.logger.warn(
          `Redis is offline (${msg}). AI Insights queue will automatically connect once Redis is online.`,
        );
      }
    });
  }

  async onApplicationBootstrap() {
    this.logger.log('Registering daily repeatable job for AI Insights...');

    try {
      // Use 2000ms timeout so application startup never blocks when Redis is offline
      await Promise.race([
        (async () => {
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
        })(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Redis connection timeout')), 2000),
        ),
      ]);

      this.logger.log('Daily repeatable job successfully registered (06:00 WIB).');
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.warn(
        `Redis server is offline (${message}). Background insight job registration skipped. Run 'docker-compose up -d redis' to enable BullMQ.`,
      );
    }
  }
}
