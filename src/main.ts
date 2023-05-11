import { NestFactory } from '@nestjs/core';
import { AppModule } from './AppModule';
import { ProducerService } from './producer/ProducerService';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    forbidNonWhitelisted: true,
  }));

  const producerService = app.get(ProducerService);
  await producerService.createGroupsAndSensors();
  await producerService.scheduleDataGeneration();

  await app.listen(3000);
}
bootstrap();
