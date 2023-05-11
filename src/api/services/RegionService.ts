import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/PrismaService';
import { Region } from '../dtos/Region';
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
      throw new BadRequestException('No sensors in the region');
    }

    return data
      .map((d) => d.temperature)
      .reduce((prev, cur) => prev > cur ? prev : cur);
  }

  async getMinTemperature(region: Region) {
    const data = await this.getLastRegionData(region);

    if (!data.length) {
      throw new BadRequestException('No sensors in the region');
    }

    return data
      .map((d) => d.temperature)
      .reduce((prev, cur) => prev < cur ? prev : cur);
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