import { GenerateInsightsUseCase } from './generate-insights.use-case';
import { AnalyticsService } from '../services/analytics.service';
import { ConfigService } from '@nestjs/config';
import { IProductRepository } from '../../../products/domain/repositories/product.repository.interface';
import { ICustomerRepository } from '../../../customers/domain/repositories/customer.repository.interface';
import { ISaleRepository } from '../../../sales/domain/repositories/sale.repository.interface';
import { IInsightRepository } from '../../domain/repositories/insight.repository.interface';
import { IAIProvider } from '../../domain/services/ai-provider.interface';

// Mock Redis to prevent real network connections
jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => {
    return {
      get: jest.fn().mockResolvedValue(null),
      setex: jest.fn().mockResolvedValue('OK'),
    };
  });
});

describe('GenerateInsightsUseCase', () => {
  let useCase: GenerateInsightsUseCase;
  let mockProductRepo: jest.Mocked<IProductRepository>;
  let mockCustomerRepo: jest.Mocked<ICustomerRepository>;
  let mockSaleRepo: jest.Mocked<ISaleRepository>;
  let mockInsightRepo: jest.Mocked<IInsightRepository>;
  let mockAiProvider: jest.Mocked<IAIProvider>;
  let analyticsService: AnalyticsService;
  let mockConfigService: Partial<ConfigService>;

  beforeEach(() => {
    mockProductRepo = {
      findAll: jest.fn().mockResolvedValue([]),
      findById: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    mockCustomerRepo = {
      findAll: jest.fn().mockResolvedValue([]),
      findById: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    };
    mockSaleRepo = {
      findAll: jest.fn().mockResolvedValue([]),
      findById: jest.fn(),
      save: jest.fn(),
    };
    mockInsightRepo = {
      save: jest.fn().mockResolvedValue(undefined),
      findLatest: jest.fn().mockResolvedValue(null),
    };
    mockAiProvider = {
      generateInsight: jest.fn(),
    };
    analyticsService = new AnalyticsService();
    mockConfigService = {
      get: jest.fn((key: string) => {
        if (key === 'REDIS_HOST') return 'localhost';
        if (key === 'REDIS_PORT') return 6379;
        return undefined;
      }) as never,
    };

    useCase = new GenerateInsightsUseCase(
      mockProductRepo,
      mockCustomerRepo,
      mockSaleRepo,
      mockInsightRepo,
      mockAiProvider,
      analyticsService,
      mockConfigService as ConfigService,
    );
  });

  it('should generate fresh insights successfully', async () => {
    const mockAiOutput = JSON.stringify({
      summary: 'Bisnis Anda berjalan dengan baik.',
      risks: ['Stok beberapa barang mulai menipis.'],
      opportunities: ['Promosikan produk terlaris.'],
      action_items: [
        {
          target_type: 'PRODUCT',
          target_name: 'Kopi Susu',
          action: 'Restock',
          reason: 'Stok tipis',
        },
      ],
    });

    mockAiProvider.generateInsight.mockResolvedValue(mockAiOutput);

    const result = await useCase.execute('company-123');

    expect(result.summary).toBe('Bisnis Anda berjalan dengan baik.');
    expect(result.risks).toContain('Stok beberapa barang mulai menipis.');
    expect(mockInsightRepo.save).toHaveBeenCalledWith(
      'company-123',
      expect.objectContaining({ summary: 'Bisnis Anda berjalan dengan baik.' }),
      'DAILY_BRIEF',
    );
  });

  it('should fallback to default values on failure', async () => {
    mockAiProvider.generateInsight.mockRejectedValue(new Error('OpenAI API Error'));

    const result = await useCase.execute('company-123');

    expect(result.summary).toBe(
      'Selamat datang di AI COO! Penjualan dan stok barang Anda sedang dianalisis.',
    );
    expect(result.isStale).toBe(true);
  });
});
