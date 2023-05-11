import { Module } from '@nestjs/common';
import { PrismaModule } from './database/PrismaModule';
import { ProducerService } from './producer/ProducerService';
import { BullModule } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';
import { ApiModule } from './api/ApiModule';

@Module({
  imports: [
    PrismaModule, ApiModule, ScheduleModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: 'sensor-redis',
        port: 6379,
      }
    }), BullModule.registerQueue({
      name: 'generate-data',
    })
  ],
  providers: [ProducerService],
})
export class AppModule {}
