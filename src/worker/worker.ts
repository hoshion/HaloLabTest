import { NestFactory } from '@nestjs/core';
import { WorkerModule } from './WorkerModule';

async function bootstrap() {
  const app = await NestFactory.create(WorkerModule)
  app.init();
}
bootstrap();