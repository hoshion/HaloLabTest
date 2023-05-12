import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/PrismaService';
import { Fish, Sensor, SensorData } from '@prisma/client';
import { Timeline } from '../dtos/Timeline';

export type SensorDataWithFish = SensorData & {
  fish: Fish[],
}

@Injectable()
export class SensorService {
  constructor (
    private prisma: PrismaService,
  ) {}

  async getLastSensorsData(sensors: Sensor[]): Promise<SensorDataWithFish[]> {
    const data = [];

    for (const sensor of sensors) {
      const sensorData = await this.prisma.sensorData.findFirst({
        where: {
          sensor: sensor.codename,
        },
        include: {
          fish: true,
        },
        orderBy: {
          time: 'desc'
        }
      });

      data.push(sensorData);
    }

    return data;
  }

  async getAverageTemperatureInTimeline(sensor: string, timeline: Timeline) {
    const data = await this.getDataInTimeline(sensor, timeline);

    if (!data.length) {
      throw new BadRequestException('No data in the group');
    }

    return this.getAverageTemperature(data);
  }

  getAverageTemperature(data: SensorDataWithFish[]): number {
    if (!data || !data.length) return 0;

    return data
      .map((d) => d.temperature)
      .reduce((prev, cur) => prev + cur, 0) / data.length;
  }

  getAverageTransparency(data: SensorDataWithFish[]) {
    if (!data || !data.length) return 0;

    return data
      .map((d) => d.transparency)
      .reduce((prev, cur) => prev + cur, 0) / data.length;
  }

  getMaxTemperature(data: SensorDataWithFish[]) {
    if (!data || !data.length) return 0;

    return data
      .map((d) => d.temperature)
      .reduce((prev, cur) => prev > cur ? prev : cur);
  }

  getMinTemperature(data: SensorDataWithFish[]) {
    if (!data || !data.length) return 0;

    return data
      .map((d) => d.temperature)
      .reduce((prev, cur) => prev < cur ? prev : cur);
  }

  async getDataInTimeline(sensor: string, timeline: Timeline): Promise<SensorDataWithFish[]> {
    return this.prisma.sensorData.findMany({
      where: {
        time: {
          gte: timeline.from,
          lte: timeline.till,
        },
        sensor,
      },
      include: {
        fish: true,
      }
    });
  }

}