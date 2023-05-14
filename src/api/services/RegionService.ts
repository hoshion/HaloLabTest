import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/PrismaService';
import { Region } from '../dtos/Region.dto';
import { SensorService } from './SensorService';

@Injectable()
export class RegionService {
  constructor (
    private prisma: PrismaService,
    private sensorService: SensorService,
  ) {}

  async getMaxTemperature (region: Region) {
    const data = await this.getLastRegionData(region);

    if (!data.length) {
      throw new BadRequestException('No data in the region');
    }

    return this.sensorService.getMaxTemperature(data);
  }

  async getMinTemperature(region: Region) {
    const data = await this.getLastRegionData(region);

    if (!data.length) {
      throw new BadRequestException('No data in the region');
    }

    return this.sensorService.getMinTemperature(data);
  }

  async getLastRegionData(region: Region) {
    const sensors = await this.getRegionSensors(region);
    return this.sensorService.getLastSensorsData(sensors);
  }

  async getRegionSensors({ xMin, xMax, yMin, yMax, zMin, zMax }: Region) {
    return this.prisma.sensor.findMany({
      where: {
        x: {
          gte: xMin,
          lte: xMax,
        },
        y: {
          gte: yMin,
          lte: yMax,
        },
        z: {
          gte: zMin,
          lte: zMax,
        },
      }
    });
  }
}