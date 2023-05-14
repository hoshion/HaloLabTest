import { PrismaService } from '../../database/PrismaService';
import { SensorDataWithFish, SensorService } from './SensorService';
import { RegionService } from './RegionService';
import { Region } from '../dtos/Region.dto';

describe('RegionService',() => {
  let prisma: PrismaService;
  let sensorService: SensorService;
  let regionService: RegionService;

  beforeEach(() => {
    prisma = new PrismaService();
    sensorService = new SensorService(prisma);
    regionService = new RegionService(prisma, sensorService);
  });

  describe('getMaxTemperature', () => {
    it('should return a max temperature from 4 data', async () => {
      jest.spyOn(regionService, 'getLastRegionData').mockImplementation(async (region: Region) => {
        return [{}] as SensorDataWithFish[];
      });
      const mocked = jest.spyOn(sensorService, 'getMaxTemperature');

      await regionService.getMaxTemperature(null);

      expect(mocked.mock.calls).toHaveLength(1);
    });

    it('should return an error with no data', async () => {
      jest.spyOn(regionService, 'getLastRegionData').mockImplementation(async (region: Region) => {
        return [] as SensorDataWithFish[];
      });

      try {
        await regionService.getMaxTemperature(null)
      } catch (e) {
        expect(e.message).toMatch('No data in the region');
      }
    });
  });

  describe('getMinTemperature', () => {
    it('should return a min temperature from 4 data', async () => {
      jest.spyOn(regionService, 'getLastRegionData').mockImplementation(async (region: Region) => {
        return [{}] as SensorDataWithFish[];
      });
      const mocked = jest.spyOn(sensorService, 'getMinTemperature');

      await regionService.getMinTemperature(null);

      expect(mocked.mock.calls).toHaveLength(1);
    });

    it('should return an error with no data', async () => {
      jest.spyOn(regionService, 'getLastRegionData').mockImplementation(async (region: Region) => {
        return [] as SensorDataWithFish[];
      });

      try {
        await regionService.getMinTemperature(null)
      } catch (e) {
        expect(e.message).toMatch('No data in the region');
      }
    });
  });
})