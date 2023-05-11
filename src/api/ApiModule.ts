import { Module } from '@nestjs/common';
import { GroupController } from './controllers/GroupController';
import { GroupService } from './services/GroupService';
import { PrismaModule } from '../database/PrismaModule';
import { RegionController } from './controllers/RegionController';
import { SensorController } from './controllers/SensorController';
import { RegionService } from './services/RegionService';
import { SensorService } from './services/SensorService';

@Module({
  controllers: [GroupController, RegionController, SensorController],
  providers: [GroupService, RegionService, SensorService],
  exports: [GroupService, RegionService, SensorService],
  imports: [PrismaModule],
})
export class ApiModule {}