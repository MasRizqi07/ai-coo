import { CreateSaleUseCase } from './create-sale.use-case';
import { ISaleRepository } from '../../domain/repositories/sale.repository.interface';
import { Sale } from '../../domain/entities/sale.entity';
import { PaymentMethod } from '@ai-coo/shared-types';
import { TenantContext } from '../../../../common/context/tenant-context';

describe('CreateSaleUseCase', () => {
  let useCase: CreateSaleUseCase;
  let mockRepository: jest.Mocked<ISaleRepository>;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn().mockResolvedValue(undefined),
      findById: jest.fn(),
      findAll: jest.fn(),
    };
    useCase = new CreateSaleUseCase(mockRepository);
  });

  it('should create and save a new sale within tenant context', async () => {
    mockRepository.findById.mockImplementation((id: string) => {
      return Promise.resolve(
        Sale.create(
          {
            companyId: 'company-abc',
            customerId: 'customer-1',
            amount: 50000,
            paymentMethod: PaymentMethod.CASH,
            paidAmount: 50000,
            changeAmount: 0,
            items: [],
          },
          id,
        ),
      );
    });

    const result = await TenantContext.run('company-abc', async () => {
      return useCase.execute({
        dto: {
          customerId: 'customer-1',
          paymentMethod: PaymentMethod.CASH,
          paidAmount: 50000,
          changeAmount: 0,
          items: [
            { productId: 'prod-1', quantity: 2 },
            { productId: 'prod-2', quantity: 1 },
          ],
        },
      });
    });

    expect(result).toBeDefined();
    expect(result.companyId).toBe('company-abc');
    expect(mockRepository.save).toHaveBeenCalledTimes(1);
    expect(mockRepository.findById).toHaveBeenCalled();
  });

  it('should throw an error if tenant context is missing', async () => {
    await expect(
      useCase.execute({
        dto: {
          customerId: undefined,
          paymentMethod: PaymentMethod.CASH,
          items: [{ productId: 'prod-1', quantity: 1 }],
        },
      }),
    ).rejects.toThrow('Tenant context missing from create sale');

    expect(mockRepository.save).not.toHaveBeenCalled();
  });
});
