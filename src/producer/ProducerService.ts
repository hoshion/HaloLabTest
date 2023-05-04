import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { RandomUtils } from '../utils/RandomUtils';
import { Greeks } from '../enums/GreekLetters';
import { SchedulerRegistry } from '@nestjs/schedule';
import { PrismaService } from '../database/PrismaService';

const MIN_GROUPS = 3;
const MAX_GROUPS = 7;
const MIN_SENSORS = 3;
const MAX_SENSORS = 7;

@Injectable()
export class ProducerService {
  constructor (
    private prisma: PrismaService,
    private schedulerRegistry: SchedulerRegistry,
    @InjectQueue('generate-data') private dataQueue: Queue,
  ) {}

  async createGroupsAndSensors() {
    const groupsAmount = RandomUtils.getIntIn(MIN_GROUPS, MAX_GROUPS);
    for (let i = 0; i < groupsAmount; i++) {
      const sensorsAmount = RandomUtils.getIntIn(MIN_SENSORS, MAX_SENSORS);
      for (let j = 0; j < sensorsAmount; j++) {
        await this.prisma.sensor.create({
          data: {
            codename: `${Greeks[i]} ${j + 1}`,
            x: RandomUtils.getIntIn(0, 50),
            y: RandomUtils.getIntIn(0, 50),
            z: RandomUtils.getIntIn(0, 50),
            outputRate: RandomUtils.getIntIn(5, 15)
          }
        });
      }
    }
  }

  async scheduleDataGeneration() {
    const sensors = await this.prisma.sensor.findMany({});

    for (const sensor of sensors) {
      const addJob = () => {
        this.dataQueue.add({
          codename: sensor.codename,
        });
      };
      const interval = setInterval(addJob, 1000 * sensor.outputRate);
      this.schedulerRegistry.addTimeout(sensor.codename, interval);
    }
  }
}