import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../src/common/prisma/prisma.module';
import { PrismaService } from '../src/common/prisma/prisma.service';

/**
 * TENANT ISOLATION TESTS
 *
 * These tests ensure that the PostgreSQL Row-Level Security (RLS) policies
 * are functioning correctly. User A in Company A should never be able to
 * query or modify data belonging to Company B.
 */
describe('Tenant Isolation (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: ['.env', '../../.env'],
        }),
        PrismaModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    prisma = app.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    // Clear tenant context and clean up
    await prisma.$executeRawUnsafe("SELECT set_config('app.current_tenant_id', '', false);");
    await prisma.saleItem.deleteMany({});
    await prisma.sale.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.customer.deleteMany({});
    await prisma.company.deleteMany({});
    await app.close();
  });

  it('should only return customers, products, and sales belonging to the current tenant', async () => {
    // 1. Create Companies
    const companyA = await prisma.company.create({
      data: { name: 'Tenant A', businessType: 'WARKOP' },
    });
    const companyB = await prisma.company.create({
      data: { name: 'Tenant B', businessType: 'RETAIL' },
    });

    // 2. Insert Company A's data under Company A context
    await prisma.setTenant(companyA.id);
    const custA = await prisma.customer.create({
      data: { name: 'Customer A', companyId: companyA.id },
    });
    const prodA = await prisma.product.create({
      data: { name: 'Product A', price: 1000, companyId: companyA.id },
    });
    await prisma.sale.create({
      data: {
        companyId: companyA.id,
        customerId: custA.id,
        amount: 1000,
        items: {
          create: [{ productId: prodA.id, quantity: 1, priceAtSale: 1000 }],
        },
      },
    });

    // 3. Insert Company B's data under Company B context
    await prisma.setTenant(companyB.id);
    const custB = await prisma.customer.create({
      data: { name: 'Customer B', companyId: companyB.id },
    });
    const prodB = await prisma.product.create({
      data: { name: 'Product B', price: 2000, companyId: companyB.id },
    });
    await prisma.sale.create({
      data: {
        companyId: companyB.id,
        customerId: custB.id,
        amount: 2000,
        items: {
          create: [{ productId: prodB.id, quantity: 1, priceAtSale: 2000 }],
        },
      },
    });

    // 4. Query as Tenant A
    await prisma.setTenant(companyA.id);
    const customers = await prisma.customer.findMany();
    const products = await prisma.product.findMany();
    const sales = await prisma.sale.findMany();

    // 5. Assertions
    expect(customers.length).toBe(1);
    expect(customers[0].name).toBe('Customer A');

    expect(products.length).toBe(1);
    expect(products[0].name).toBe('Product A');

    expect(sales.length).toBe(1);
    expect(Number(sales[0].amount)).toBe(1000);
  });

  it("should block writing to another tenant's data (RLS Policy Check Violation)", async () => {
    const companyA = await prisma.company.create({
      data: { name: 'Tenant A2', businessType: 'WARKOP' },
    });
    const companyB = await prisma.company.create({
      data: { name: 'Tenant B2', businessType: 'RETAIL' },
    });

    // Set tenant context to Company A
    await prisma.setTenant(companyA.id);

    // Attempt to insert customer for Company B
    await expect(
      prisma.customer.create({
        data: { name: 'Cheater Customer', companyId: companyB.id },
      }),
    ).rejects.toThrow();

    // Attempt to insert product for Company B
    await expect(
      prisma.product.create({
        data: { name: 'Cheater Product', price: 5000, companyId: companyB.id },
      }),
    ).rejects.toThrow();
  });

  it("should prevent updating another tenant's data (RLS Policy Check)", async () => {
    const companyA = await prisma.company.create({
      data: { name: 'Tenant A3', businessType: 'WARKOP' },
    });
    const companyB = await prisma.company.create({
      data: { name: 'Tenant B3', businessType: 'RETAIL' },
    });

    // Setup: Create Company B's customer under Company B context
    await prisma.setTenant(companyB.id);
    const custB = await prisma.customer.create({
      data: { name: 'Customer B3', companyId: companyB.id },
    });

    // Switch context to Tenant A
    await prisma.setTenant(companyA.id);

    // Try to update Company B's customer. Under RLS, it won't find it to update (returns 0 rows affected)
    const updateResult = await prisma.customer.updateMany({
      where: { id: custB.id },
      data: { name: 'Hacked name' },
    });
    expect(updateResult.count).toBe(0);

    // Try to update using direct update (should throw because it filters out the record and fails with RecordNotFound)
    await expect(
      prisma.customer.update({
        where: { id: custB.id },
        data: { name: 'Hacked name 2' },
      }),
    ).rejects.toThrow();
  });
});
