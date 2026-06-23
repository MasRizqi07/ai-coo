import { CreateCustomerUseCase } from './create-customer.use-case';
import { ICustomerRepository } from '../../domain/repositories/customer.repository.interface';
import { Customer } from '../../domain/entities/customer.entity';

describe('CreateCustomerUseCase', () => {
  let useCase: CreateCustomerUseCase;
  let mockRepository: jest.Mocked<ICustomerRepository>;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn().mockResolvedValue(undefined),
      findById: jest.fn(),
      findAllByCompany: jest.fn(),
    };
    useCase = new CreateCustomerUseCase(mockRepository);
  });

  it('should create and save a new customer', async () => {
    const dto = { name: 'Test Customer', phone: '08123456789' };
    const customer = await useCase.execute({ companyId: 'tenant-1', dto });

    expect(customer.name).toBe('Test Customer');
    expect(customer.phone?.value).toBe('628123456789');
    expect(mockRepository.save).toHaveBeenCalledTimes(1);
    expect(mockRepository.save).toHaveBeenCalledWith(expect.any(Customer));
  });

  it('should throw an error if validation fails', async () => {
    const dto = { name: '' };
    await expect(useCase.execute({ companyId: 'tenant-1', dto })).rejects.toThrow(
      'Customer name is required',
    );
    expect(mockRepository.save).not.toHaveBeenCalled();
  });
});
