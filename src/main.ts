import { NestFactory } from '@nestjs/core';
import { AppModule } from './AppModule';
import { ProducerService } from './producer/ProducerService';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    forbidNonWhitelisted: true,
  }));

  const config = new DocumentBuilder()
    .setTitle('Sensors')
    .setDescription('The sensors API description')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const producerService = app.get(ProducerService);
  await producerService.createGroupsAndSensors();
  await producerService.scheduleDataGeneration();


  await app.listen(3000);
}
bootstrap();
