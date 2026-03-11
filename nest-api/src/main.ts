import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, HttpException, HttpStatus } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ─── GLOBAL PREFIX ─────────────────────────────────────────────────────────
  // Matches React frontend's API_URL: "http://localhost:5159/api"
  app.setGlobalPrefix('api');

  // ─── VALIDATION PIPE ───────────────────────────────────────────────────────
  // Validate all incoming DTOs automatically
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,           // Strip fields not in DTO (security)
      forbidNonWhitelisted: false, // Don't throw on extra fields, just strip them
      transform: true,           // Auto-transform payloads to DTO class instances
      transformOptions: {
        enableImplicitConversion: true, // Convert string "123" → number 123 etc.
      },
    }),
  );

  // ─── CORS ──────────────────────────────────────────────────────────────────
  app.enableCors({
    origin: [
      'http://localhost:5173', // React frontend Server URL (Vite default)
      'http://localhost:3000', // CRA fallback
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await app.listen(5159);
  console.log('Server running at http://localhost:5159/api');
}
bootstrap();
