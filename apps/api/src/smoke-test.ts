import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './common/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

async function bootstrap() {
  console.log('⏳ Bootstrapping application context...');
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const prisma = app.get(PrismaService);
  const jwt = app.get(JwtService);

  console.log('🛠️  Preparing dummy data...');
  // 1. Create dummy company
  const company = await prisma.company.upsert({
    where: { id: 'smoke-test-company' },
    update: {},
    create: {
      id: 'smoke-test-company',
      name: 'Smoke Test Corp',
      businessType: 'WARKOP'
    }
  });

  // 2. Add dummy product
  await prisma.product.upsert({
    where: { id: 'smoke-test-product' },
    update: {},
    create: {
      id: 'smoke-test-product',
      companyId: company.id,
      name: 'Kopi Susu AI',
      price: 25000,
      stockQuantity: 5,
    }
  });

  // 3. Add dummy sale
  await prisma.sale.upsert({
    where: { id: 'smoke-test-sale' },
    update: {},
    create: {
      id: 'smoke-test-sale',
      companyId: company.id,
      amount: 50000,
      items: {
        create: [
          {
            productId: 'smoke-test-product',
            quantity: 2,
            priceAtSale: 25000
          }
        ]
      }
    }
  });

  console.log('🔑 Generating JWT Token...');
  const token = await jwt.signAsync({ companyId: company.id, userId: 'smoke-test-user' });
  console.log('Token created successfully.\n');

  console.log('🚀 Mengirim request ke GET http://localhost:3001/ai-insights/latest ...');
  try {
    const response = await fetch('http://localhost:3001/ai-insights/latest', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    const status = response.status;
    let data;
    const text = await response.text();
    try {
      data = JSON.parse(text);
    } catch {
      data = text; // Fallback jika bukan JSON
    }

    console.log('\n================ ACTUAL RESPONSE ================');
    console.log(`STATUS CODE : ${status}`);
    console.log(`BODY        :`);
    console.log(typeof data === 'string' ? data : JSON.stringify(data, null, 2));
    console.log('=================================================\n');

  } catch (error) {
    console.error('❌ Request Error:', error);
  }

  await app.close();
  process.exit(0);
}

bootstrap();
