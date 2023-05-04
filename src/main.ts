import { NestFactory } from '@nestjs/core';
import { AppModule } from './AppModule';
import { ProducerService } from './producer/ProducerService';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const producerService = app.get(ProducerService);
  await producerService.createGroupsAndSensors();
  await producerService.scheduleDataGeneration();

  await app.listen(3000);
}
bootstrap();
