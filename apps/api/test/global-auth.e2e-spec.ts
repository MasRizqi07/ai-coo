import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Controller, Get } from '@nestjs/common';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import request from 'supertest';
import { App } from 'supertest/types';
import { JwtAuthGuard } from '../src/modules/auth/jwt-auth.guard';
import { Public } from '../src/common/decorators/public.decorator';

@Controller('sales')
class MockSalesController {
  @Get()
  getSales() {
    return [];
  }
}

@Controller('products')
class MockProductsController {
  @Get()
  getProducts() {
    return [];
  }
}

@Controller('dashboard')
class MockDashboardController {
  @Get('stats')
  getStats() {
    return { data: 'stats' };
  }
}

@Controller('health')
@Public()
class MockHealthController {
  @Get()
  getHealth() {
    return { status: 'ok' };
  }
}

describe('Global Auth Guard (isolated e2e)', () => {
  let app: INestApplication<App>;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [
        MockSalesController,
        MockProductsController,
        MockDashboardController,
        MockHealthController,
      ],
      providers: [
        {
          provide: APP_GUARD,
          useClass: JwtAuthGuard,
        },
        {
          provide: JwtService,
          useValue: { verifyAsync: jest.fn() },
        },
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('secret') },
        },
        Reflector,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    jwtService = app.get<JwtService>(JwtService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/sales (GET) should return 401 without token', () => {
    return request(app.getHttpServer()).get('/sales').expect(401);
  });

  it('/health (GET) should return 200 without token because it is public', () => {
    return request(app.getHttpServer()).get('/health').expect(200);
  });

  it('/sales (GET) should return 200 WITH valid token', () => {
    (jwtService.verifyAsync as jest.Mock).mockResolvedValueOnce({
      companyId: 'test-123',
      userId: 'user-1',
    });
    return request(app.getHttpServer())
      .get('/sales')
      .set('Authorization', 'Bearer valid-token')
      .expect(200);
  });

  it('/products (GET) should return 200 WITH valid token', () => {
    (jwtService.verifyAsync as jest.Mock).mockResolvedValueOnce({
      companyId: 'test-123',
      userId: 'user-1',
    });
    return request(app.getHttpServer())
      .get('/products')
      .set('Authorization', 'Bearer valid-token')
      .expect(200);
  });

  it('/dashboard/stats (GET) should return 200 WITH valid token', () => {
    (jwtService.verifyAsync as jest.Mock).mockResolvedValueOnce({
      companyId: 'test-123',
      userId: 'user-1',
    });
    return request(app.getHttpServer())
      .get('/dashboard/stats')
      .set('Authorization', 'Bearer valid-token')
      .expect(200);
  });
});
