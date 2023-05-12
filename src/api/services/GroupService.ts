import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/PrismaService';
import { Fish, Sensor, SensorData } from '@prisma/client';
import { SensorService } from './SensorService';

@Injectable()
export class GroupService {
  constructor (
    private prisma: PrismaService,
    private sensorService: SensorService,
  ) {}

  async getAverageTransparency(name: string) {
    const sensorsData = await this.getLastGroupData(name);

    if (!sensorsData.length) {
      throw new BadRequestException('No data in the group');
    }

    return this.sensorService.getAverageTransparency(sensorsData);
  }

  async getAverageTemperature(name: string) {
    const sensorsData = await this.getLastGroupData(name);

    if (!sensorsData.length) {
      throw new BadRequestException('No data in the group');
    }

    return this.sensorService.getAverageTemperature(sensorsData);
  }

  async getLastSpecies(name: string): Promise<Fish[]> {
    const sensorsData = await this.getLastGroupData(name);
    const result = [];
    for (const { fish } of sensorsData) {
      for (const { name, amount } of fish) {
        const found = result.find((v) => v.name === name);
        if (!found) {
          result.push({ name, amount, });
        } else {
          found.amount = found.amount > amount ? found.amount : amount;
        }
      }
    }

    return result;
  }

  async getTopNSpecies(name: string, amount: number) {
    const species = await this.getLastSpecies(name);
    species.sort((a, b) => b.amount - a.amount);
    return species.slice(0, amount);
  }

  async getGroupSensors(name: string): Promise<Sensor[]> {
    return this.prisma.sensor.findMany({
      where: {
        codename: {
          contains: name,
        },
      },
    });
  }

  async getLastGroupData(name: string) {
    const sensors = await this.getGroupSensors(name);
    return this.sensorService.getLastSensorsData(sensors);
  }
}