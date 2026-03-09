import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix — matches React frontend's API_URL: "http://localhost:5159/api"
  app.setGlobalPrefix('api');

  // Validate all incoming DTOs automatically
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,       // strip unknown fields
      forbidNonWhitelisted: false,
      transform: true,       // auto-transform payloads to DTO class instances
    }),
  );

  app.enableCors({
    origin: 'http://localhost:5173', // React Frontend Server URL
    credentials: true
  });

  await app.listen(5159);
  console.log('Server running at http://localhost:5159/api');
}
bootstrap();
