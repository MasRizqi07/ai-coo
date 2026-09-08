import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { standardHelmetOptions } from '@antigravity/security';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('API_PORT', 3001);
  const frontendUrl = configService.get<string>('FRONTEND_URL', 'http://localhost:3000');

  // Security: Helmet sets various HTTP headers for protection
  app.use(helmet(standardHelmetOptions));

  // CORS: Only allow the frontend origin
  app.enableCors({
    origin: frontendUrl,
    credentials: true,
  });

  // Global validation pipe: rejects unknown properties, transforms types
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global exception filter: standard error envelope (spec §10.1)
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global response interceptor: standard success envelope (spec §10.1)
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Swagger/OpenAPI: development only
  if (configService.get<string>('NODE_ENV') !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('AI COO API')
      .setDescription('AI Chief Operating Officer for Indonesian UMKM')
      .setVersion('0.1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document);
  }

  await app.listen(port);
}

void bootstrap();
