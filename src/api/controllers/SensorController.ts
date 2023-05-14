import { Controller, Get, Param, Query } from '@nestjs/common';
import { SensorService } from '../services/SensorService';
import { Timeline } from '../dtos/Timeline.dto';

@Controller({
  path: 'sensor',
})
export class SensorController {
  constructor (
    private sensorService: SensorService,
  ) {}

  @Get('/:codeName/temperature/average')
  async getAverageTemperature(
    @Param('codeName') sensor: string,
    @Query() timeline: Timeline,
  ) {
    return this.sensorService.getAverageTemperatureInTimeline(sensor, timeline);
  }
}