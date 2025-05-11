import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './core/http-exception.filter';
import { CustomLogger } from './core/customLogger';
import { BadRequestException, ValidationError, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const config = app.get(ConfigService);
  const port = config.get<number>('PORT');

  app.setGlobalPrefix('api'); 
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useLogger(new CustomLogger());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new BadRequestException(validationErrors);
      },
    }),
  );
  
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Budget Web Services')
    .setDescription('API application')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api-docs', app, document);


  await app.listen(port||3000);
}

bootstrap();
