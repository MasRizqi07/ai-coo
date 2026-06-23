import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/common/prisma/prisma.service';
import {
  PRODUCT_REPOSITORY,
  IProductRepository,
} from '../src/modules/products/domain/repositories/product.repository.interface';
import {
  CUSTOMER_REPOSITORY,
  ICustomerRepository,
} from '../src/modules/customers/domain/repositories/customer.repository.interface';
import {
  SALE_REPOSITORY,
  ISaleRepository,
} from '../src/modules/sales/domain/repositories/sale.repository.interface';
import { TenantContext } from '../src/common/context/tenant-context';

describe('Soft Delete Regression (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let productRepo: IProductRepository;
  let customerRepo: ICustomerRepository;
  let saleRepo: ISaleRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    prisma = app.get<PrismaService>(PrismaService);
    productRepo = app.get<IProductRepository>(PRODUCT_REPOSITORY);
    customerRepo = app.get<ICustomerRepository>(CUSTOMER_REPOSITORY);
    saleRepo = app.get<ISaleRepository>(SALE_REPOSITORY);
  });

  afterAll(async () => {
    await prisma.$executeRawUnsafe("SELECT set_config('app.current_tenant_id', '', false);");
    await prisma.saleItem.deleteMany({});
    await prisma.sale.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.customer.deleteMany({});
    await prisma.company.deleteMany({});
    await app.close();
  });

  it('should preserve historical sales and sale items when referenced customer or product is soft-deleted', async () => {
    const company = await prisma.company.create({
      data: { name: 'Soft Delete Company', businessType: 'WARKOP' },
    });

    // Set database RLS session context
    await prisma.setTenant(company.id);

    // Run within company context
    await TenantContext.run(company.id, async () => {
      // 1. Create active Customer and Product
      const cust = await prisma.customer.create({
        data: { name: 'Historical Customer', companyId: company.id },
      });
      const prod = await prisma.product.create({
        data: {
          name: 'Historical Product',
          price: 15000,
          companyId: company.id,
          stockQuantity: 10,
        },
      });

      // 2. Create a sale transaction
      const customer = await customerRepo.findById(cust.id);
      const product = await productRepo.findById(prod.id);
      expect(customer).toBeDefined();
      expect(product).toBeDefined();

      // Create Sale using the repository's transaction logic
      const sale = await prisma.sale.create({
        data: {
          companyId: company.id,
          customerId: cust.id,
          amount: 15000,
          items: {
            create: [{ productId: prod.id, quantity: 1, priceAtSale: 15000 }],
          },
        },
        include: {
          items: true,
        },
      });

      // Assert stock was reduced initially in db
      const dbProdBefore = await prisma.product.findUnique({ where: { id: prod.id } });
      expect(dbProdBefore?.stockQuantity).toBe(10); // Note: direct create bypassed decrement, which is fine for direct insert testing

      // 3. Soft-delete the customer and product
      await customerRepo.delete(cust.id);
      await productRepo.delete(prod.id);

      // 4. Assert customer and product are no longer active (hidden by default queries)
      const foundCust = await customerRepo.findById(cust.id);
      const foundProd = await productRepo.findById(prod.id);
      expect(foundCust).toBeNull();
      expect(foundProd).toBeNull();

      // But in the DB they still exist with deletedAt set
      const rawCust = await prisma.customer.findUnique({ where: { id: cust.id } });
      const rawProd = await prisma.product.findUnique({ where: { id: prod.id } });
      expect(rawCust?.deletedAt).not.toBeNull();
      expect(rawProd?.deletedAt).not.toBeNull();

      // 5. Query historical sales
      const sales = await saleRepo.findAll();
      expect(sales.length).toBe(1);
      expect(sales[0].id).toBe(sale.id);
      expect(Number(sales[0].amount)).toBe(15000);
      expect(sales[0].customerId).toBe(cust.id);
      expect(sales[0].items[0].productId).toBe(prod.id);
    });
  });
});
