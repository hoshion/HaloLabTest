import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Sensor } from '@prisma/client';
import { RandomUtils } from '../utils/RandomUtils';
import { PrismaService } from '../database/PrismaService';

@Processor('generate-data')
export class WorkerService {
  constructor (
    private prisma: PrismaService,
  ) {}

  @Process()
  async generateData(job: Job<{ codename: string }>) {
    const { codename } = job.data;
    const sensors = await this.prisma.sensor.findMany({});
    const sensor = sensors.find((s) => s.codename === codename);

    const time = new Date();
    const temperature = +this.generateTemperature(sensor);
    const transparency = await this.generateTransparency(sensor, sensors);

    console.log(`${time.toISOString()}: ${codename}(${sensor.x} ${sensor.y} ${sensor.z}), temp: ${temperature} C, transp: ${transparency}%`);
    await this.prisma.sensorData.create({
      data: {
        sensor: codename,
        time,
        transparency,
        temperature,
      },
    })
  }

  generateTemperature (sensor: Sensor) {
    return RandomUtils.getIn(20 - sensor.y * 0.24 - 3, 20 - sensor.y * 0.24 + 3).toFixed(2);
  }

  async generateTransparency(sensor: Sensor, sensors: Sensor[]) {
    const filtered = sensors.filter((s) => s.codename !== sensor.codename);
    const { nearest, distance } = this.findNearest(sensor, filtered);
    console.log(`Nearest for ${sensor.codename} is ${nearest.codename}: ${distance}m`);
    const data = await this.getLastData(nearest);
    console.log(data);
    if (!data) {
      return RandomUtils.getIntIn(30, 70);
    } else {
      const transparency = data.transparency;
      let result = RandomUtils.getIntIn(transparency - distance * 0.4, transparency + distance * 0.4);
      if (result < 0) {
        result += 20;
      } else if (result > 100) {
        result -= 20;
      }
      return result;
    }
  }

  findNearest (sensor: Sensor, sensors: Sensor[]) {
    let nearest = sensors[0];
    let distance = this.getDistance(sensor, nearest);
    for (let i = 1; i < sensors.length; i++) {
      const s = sensors[i];
      const d = this.getDistance(s, sensor);
      if (d < distance) {
        nearest = s;
        distance = d;
      }
    }

    return {
      nearest,
      distance,
    };
  }

  getDistance(first: Sensor, second: Sensor) {
    const x = Math.pow(first.x - second.x, 2);
    const y = Math.pow(first.y - second.y, 2);
    const z = Math.pow(first.z - second.z, 2);
    return Math.sqrt(x + y + z);
  }

  getLastData({ codename: sensor }: Sensor) {
    return this.prisma.sensorData.findFirst({
      where: {
        sensor,
      },
      orderBy: {
        time: 'desc',
      },
      include: {
        fish: true,
      }
    });
  }
}