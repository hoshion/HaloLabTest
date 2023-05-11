import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/PrismaService';
import { Fish, Sensor, SensorData } from '@prisma/client';
import { Timeline } from '../dtos/Timeline';

type SensorDataWithFish = SensorData & {
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

  async getAverageTemperature(sensor: string, timeline: Timeline) {
    const data = await this.getDataInTimeline(sensor, timeline);
    return data
      .map((d) => d.temperature)
      .reduce((prev, cur) => prev + cur, 0) / data.length;
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