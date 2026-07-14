import { Injectable, Inject } from '@nestjs/common';
import { Logger } from '@antigravity/logger';
import { z } from 'zod';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import {
  IProductRepository,
  PRODUCT_REPOSITORY,
} from '../../../products/domain/repositories/product.repository.interface';
import {
  ICustomerRepository,
  CUSTOMER_REPOSITORY,
} from '../../../customers/domain/repositories/customer.repository.interface';
import {
  ISaleRepository,
  SALE_REPOSITORY,
} from '../../../sales/domain/repositories/sale.repository.interface';
import {
  IInsightRepository,
  INSIGHT_REPOSITORY,
} from '../../domain/repositories/insight.repository.interface';
import { IAIProvider, AI_PROVIDER } from '../../domain/services/ai-provider.interface';
import { AnalyticsService } from '../services/analytics.service';
import { TenantContext } from '../../../../common/context/tenant-context';

const actionItemSchema = z.object({
  target_type: z.enum(['PRODUCT', 'CUSTOMER', 'INVENTORY', 'OTHER']),
  target_name: z.string(),
  action: z.string(),
  reason: z.string(),
});

const insightPayloadSchema = z.object({
  summary: z.string(),
  risks: z.array(z.string()),
  opportunities: z.array(z.string()),
  action_items: z.array(actionItemSchema),
});

export type InsightPayload = z.infer<typeof insightPayloadSchema>;

@Injectable()
export class GenerateInsightsUseCase {
  private readonly logger = new Logger({ service: 'GenerateInsightsUseCase' });
  private readonly redis: Redis;

  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: ICustomerRepository,
    @Inject(SALE_REPOSITORY)
    private readonly saleRepository: ISaleRepository,
    @Inject(INSIGHT_REPOSITORY)
    private readonly insightRepository: IInsightRepository,
    @Inject(AI_PROVIDER)
    private readonly aiProvider: IAIProvider,
    private readonly analyticsService: AnalyticsService,
    private readonly configService: ConfigService,
  ) {
    const host = this.configService.get<string>('REDIS_HOST') || 'localhost';
    const port = Number(this.configService.get<number>('REDIS_PORT')) || 6379;
    this.redis = new Redis({ host, port });
  }

  async execute(companyId: string): Promise<InsightPayload & { isStale?: boolean }> {
    const cacheKey = `insight:latest:${companyId}`;

    try {
      // 1. Attempt to generate fresh insight
      const insight = await this.generateFresh(companyId);

      // Cache the valid payload for 24 hours
      await this.redis.setex(cacheKey, 24 * 60 * 60, JSON.stringify(insight));

      return insight;
    } catch (error) {
      this.logger.error(
        `Failed to generate fresh AI insight for company ${companyId}. Attempting stale cache fallback.`,
        error,
      );

      // 2. Fallback to cache
      const cached = await this.redis.get(cacheKey);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          return { ...parsed, isStale: true };
        } catch {
          // Ignore parse errors on cached payload
        }
      }

      // 3. Fallback to database
      const dbInsight = await this.insightRepository.findLatest(companyId);
      if (dbInsight) {
        return { ...(dbInsight as any), isStale: true };
      }

      // 4. Fallback to standard friendly default
      return {
        summary: 'Selamat datang di AI COO! Penjualan dan stok barang Anda sedang dianalisis.',
        risks: ['Belum ada data transaksi yang cukup untuk menyusun analisis risiko saat ini.'],
        opportunities: [
          'Terus catat penjualan produk dan data pelanggan Anda untuk mendapatkan ringkasan performa yang akurat.',
        ],
        action_items: [],
        isStale: true,
      };
    }
  }

  private async generateFresh(companyId: string): Promise<InsightPayload> {
    // We execute inside TenantContext to ensure the repositories retrieve the correct tenant records
    return TenantContext.run(companyId, async () => {
      const [products, customers, sales] = await Promise.all([
        this.productRepository.findAll(),
        this.customerRepository.findAll(),
        this.saleRepository.findAll(),
      ]);

      const metrics = this.analyticsService.aggregate({ sales, products, customers });

      const prompt = `
      Anda adalah AI Chief Operating Officer (COO) untuk UMKM di Indonesia. 
      Analisis metrik bisnis berikut untuk menyusun analisis harian, risiko, peluang, dan rencana tindakan konkret dalam Bahasa Indonesia.

      Metrik Terverifikasi:
      1. Tren Pendapatan (7 hari terakhir vs 7 hari sebelumnya):
         - Pendapatan Periode Ini: Rp ${metrics.revenueTrend.currentPeriodRevenue}
         - Pendapatan Periode Sebelumnya: Rp ${metrics.revenueTrend.previousPeriodRevenue}
         - Perubahan Persentase: ${metrics.revenueTrend.percentageChange}%
      2. Pelanggan Terbaik: ${metrics.topCustomer ? `${metrics.topCustomer.name} (Total Belanja: Rp ${metrics.topCustomer.totalSpent})` : 'Tidak ada'}
      3. Pelanggan Berisiko (tidak melakukan pembelian selama 14 hari atau lebih):
      ${metrics.atRiskCustomers.map((c) => `   - ${c.name} (terakhir beli ${c.daysSinceLastPurchase} hari lalu)`).join('\n') || '   - Tidak ada'}
      4. Produk Stok Menipis (< 15 unit):
      ${metrics.lowStockProducts.map((p) => `   - ${p.name} (Stok: ${p.stockQuantity} unit)`).join('\n') || '   - Tidak ada'}
      5. Produk Terlaris (30 hari terakhir): ${metrics.fastestMovingProduct ? `${metrics.fastestMovingProduct.name} (${metrics.fastestMovingProduct.quantitySold} unit terjual)` : 'Tidak ada'}

      ATURAN PENTING:
      - JANGAN merekayasa nama pelanggan atau produk baru yang tidak tercantum di atas.
      - JANGAN merekayasa angka keuangan atau stok baru yang tidak tercantum di atas.
      - Tulis tanggapan dalam Bahasa Indonesia yang profesional dan mudah dimengerti pemilik UMKM.
      - Wajib mengembalikan objek JSON yang sesuai dengan skema.
      `;

      const jsonSchema = {
        type: 'object',
        properties: {
          summary: {
            type: 'string',
            description: 'Daily summary brief of the business performance.',
          },
          risks: {
            type: 'array',
            items: { type: 'string' },
            description: 'Potential risks identified from metrics.',
          },
          opportunities: {
            type: 'array',
            items: { type: 'string' },
            description: 'Opportunities to grow sales or optimize inventory.',
          },
          action_items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                target_type: {
                  type: 'string',
                  enum: ['PRODUCT', 'CUSTOMER', 'INVENTORY', 'OTHER'],
                },
                target_name: {
                  type: 'string',
                  description: 'Name of the specific customer or product.',
                },
                action: { type: 'string', description: 'Concretely what the owner should do.' },
                reason: { type: 'string', description: 'Why this action is recommended.' },
              },
              required: ['target_type', 'target_name', 'action', 'reason'],
              additionalProperties: false,
            },
            description: 'Actionable steps for the business owner.',
          },
        },
        required: ['summary', 'risks', 'opportunities', 'action_items'],
        additionalProperties: false,
      };

      // Call AI Provider with Retry Once logic
      let attempt = 0;
      let aiResponseText = '';

      while (attempt < 2) {
        try {
          aiResponseText = await this.aiProvider.generateInsight(prompt, jsonSchema);
          const parsed = JSON.parse(aiResponseText);
          const validated = insightPayloadSchema.parse(parsed);

          // Write insight to database
          await this.insightRepository.save(companyId, validated, 'DAILY_BRIEF');

          return validated;
        } catch (err) {
          attempt++;
          this.logger.warn(
            `AI generation attempt ${attempt} failed: ${(err as any).message}. Retrying...`,
          );
          if (attempt >= 2) {
            throw err; // bubble up to try cache/db fallback
          }
        }
      }

      throw new Error('AI generation failed after retries');
    });
  }
}
