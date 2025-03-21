import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app/app.module';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';

async function bootstrap() {
  // Create the NestJS application instance
  const app = await NestFactory.create(AppModule);

  // Enable global validation with class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );
  // Use middleware
  app.use(cookieParser());

  // Enable CORS for frontend communication
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  // Register global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Load environment variables
  const configService = app.get(ConfigService);
  const PORT = +configService.get('API_PORT') || 3000;
  const ENV = configService.get('API_ENV') || 'development';

  /**
   * Swagger Configuration
   */
  const config = new DocumentBuilder()
    .setTitle('Questions & Answers API')
    .setDescription('Use the base API URL as http://localhost:3000')
    .setTermsOfService('http://localhost:3000/terms-of-service')
    .addServer('http://localhost:3000')
    .setVersion('1.0')
    .build();

  // Create and setup Swagger documentation
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Start the application
  await app.listen(PORT, () => {
    console.log(`Server started in MODE: ${ENV} on Port: ${PORT}`);
  });
}
bootstrap();
