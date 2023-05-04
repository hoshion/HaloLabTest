import { Module } from '@nestjs/common';
import { WorkerService } from './WorkerService';
import { BullModule } from '@nestjs/bull';
import { PrismaModule } from '../database/PrismaModule';

@Module({
  imports: [
    PrismaModule,
    BullModule.forRoot({
      redis: {
        host: 'sensor-redis',
        port: 6379,
      }
    }),
    BullModule.registerQueue({
      name: 'generate-data',
    }),
  ],
  providers: [WorkerService]
})
export class WorkerModule {}