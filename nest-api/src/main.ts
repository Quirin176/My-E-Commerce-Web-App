import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ──────────────────── GLOBAL PREFIX ────────────────────
  app.setGlobalPrefix('api');   // Matches React frontend's API_URL: "http://localhost:5159/api"

  // ──────────────────── SWAGGER SETUP ────────────────────
  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('API documentation')
    .setVersion('1.0')
    .addBearerAuth() // if using JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // IMPORTANT: respect global prefix
  SwaggerModule.setup('swagger/index.html', app, document);   // Swagger URL: "http://localhost:5159/swagger/index.html"

  // ──────────────────── VALIDATION PIPE ────────────────────
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

  // ──────────────────── CORS ────────────────────
  app.enableCors({
    origin: [
      'http://localhost:5173', // React frontend Server URL (Vite default)
      'http://localhost:3000', // CRA fallback
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await app.listen(5159);
  console.log('Server running at http://localhost:5159/api');
  console.log('Swagger UI at http://localhost:5159/swagger/index.html')
}
bootstrap();
