import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const API_PREFIX = 'api/v1';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(API_PREFIX);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
