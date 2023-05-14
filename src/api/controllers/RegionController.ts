import { Controller, Get, Query } from '@nestjs/common';
import { RegionService } from '../services/RegionService';
import { Region } from '../dtos/Region.dto';

@Controller({
  path: 'region'
})
export class RegionController {
  constructor (
    private regionService: RegionService,
  ) {}

  @Get('/temperature/max')
  async getMaxTemperature(
    @Query() region: Region,
  ): Promise<number> {
    return this.regionService.getMaxTemperature(region);
  }

  @Get('/temperature/min')
  async getMinTemperature(
    @Query() region: Region,
  ): Promise<number> {
    return this.regionService.getMinTemperature(region);
  }
}