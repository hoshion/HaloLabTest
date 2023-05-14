import { PrismaService } from '../../database/PrismaService';
import { SensorDataWithFish, SensorService } from './SensorService';
import { Timeline } from '../dtos/Timeline.dto';

describe('SensorService', () => {
  let prisma: PrismaService;
  let sensorService: SensorService;

  beforeEach(() => {
    prisma = new PrismaService();
    sensorService = new SensorService(prisma);
  });

  describe('getAverageTemperatureInTimeline', () => {
    it('should return an average temperature from 3 data', async () => {
      jest.spyOn(sensorService, 'getDataInTimeline').mockImplementation(async (name: string, timeline: Timeline) => {
        return [{
          temperature: 16.55,
        }, {
          temperature: 17.44,
        }, {
          temperature: 8.16,
        }] as SensorDataWithFish[];
      });

      const avg = await sensorService.getAverageTemperatureInTimeline('alpha 1', null);

      expect(avg).toBeCloseTo(14.05);
    });

    it('', async () => {
      jest.spyOn(sensorService, 'getDataInTimeline').mockImplementation(async (name: string, timeline: Timeline) => {
        return [] as SensorDataWithFish[];
      });

      try {
        await sensorService.getAverageTemperatureInTimeline('alpha 1', null);
      } catch (e) {
        expect(e.message).toMatch('No data in the group');
      }

    })
  });

  describe('getAverageTemperature', () => {
    it('should return an average temperature with 3 data', async () => {
      const result = [{
        temperature: 16.55,
      }, {
        temperature: 17.44,
      }, {
        temperature: 8.16,
      }] as SensorDataWithFish[];

      const avg = sensorService.getAverageTemperature(result);

      expect(avg).toBeCloseTo(14.05);
    });

    it('should return 0 with no data', async () => {
      const result = [];

      const avg = sensorService.getAverageTemperature(result);

      expect(avg).toBeCloseTo(0);
    });
  });

  describe('getAverageTransparency', () => {
    it('should return an average transparency with 3 data', async () => {
      const result = [{
        transparency: 33,
      }, {
        transparency: 45,
      }, {
        transparency: 23,
      }] as SensorDataWithFish[];

      const avg = sensorService.getAverageTransparency(result);

      expect(avg).toBeCloseTo(33.666);
    });

    it('should return 0 with no data', async () => {
      const result = [];

      const avg = sensorService.getAverageTemperature(result);

      expect(avg).toBeCloseTo(0);
    });
  });

  describe('getMaxTemperature', () => {
    it('should return a max temperature from 5 data', async () => {
      const result = [{
        temperature: 16.55,
      }, {
        temperature: 17.44,
      }, {
        temperature: 8.16,
      }, {
        temperature: 13.15,
      }, {
        temperature: 20.37,
      }] as SensorDataWithFish[];

      const avg = sensorService.getMaxTemperature(result);

      expect(avg).toBe(20.37);
    });

    it('should return 0 with no data', async () => {
      const result = [];

      const avg = sensorService.getMaxTemperature(result);

      expect(avg).toBeCloseTo(0);
    });

    describe('getMinTemperature', () => {
      it('should return a min temperature from 5 data', async () => {
        const result = [{
          temperature: 16.55,
        }, {
          temperature: 17.44,
        }, {
          temperature: 8.16,
        }, {
          temperature: 13.15,
        }, {
          temperature: 20.37,
        }] as SensorDataWithFish[];

        const avg = sensorService.getMinTemperature(result);

        expect(avg).toBe(8.16);
      });

      it('should return 0 with no data', async () => {
        const result = [];

        const avg = sensorService.getMinTemperature(result);

        expect(avg).toBeCloseTo(0);
      });
    });
  });
});