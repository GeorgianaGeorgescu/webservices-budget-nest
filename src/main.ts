import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './core/http-exception.filter';
import { CustomLogger } from './core/customLogger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const config = app.get(ConfigService);
  const port = config.get<number>('PORT');

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useLogger(new CustomLogger());
  app.enableCors();
  await app.listen(port||3000);
}

bootstrap();
