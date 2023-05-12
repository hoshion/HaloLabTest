import { PrismaService } from '../../database/PrismaService';
import { GroupService } from './GroupService';
import { SensorDataWithFish, SensorService } from './SensorService';
import { Fish as FishEnum } from '../../enums/Fish';
import { Fish } from '@prisma/client';

describe('GroupService', () => {
  let prisma: PrismaService;
  let sensorService: SensorService;
  let groupService: GroupService;

  beforeEach(() => {
    prisma = new PrismaService();
    sensorService = new SensorService(prisma);
    groupService = new GroupService(prisma, sensorService);
  });

  describe('getAverageTransparency', () => {
    it('should call getAverageTransparency if there is data', async () => {
      jest.spyOn(groupService, 'getLastGroupData').mockImplementation(async (name: string) => {
        return [{}] as SensorDataWithFish[];
      });
      const mocked = jest.spyOn(sensorService, 'getAverageTransparency');

      await groupService.getAverageTransparency('alpha');

      expect(mocked.mock.calls).toHaveLength(1);
    });

    it('should return an error with no data', async () => {
      jest.spyOn(groupService, 'getLastGroupData').mockImplementation(async (name: string) => {
        return [] as SensorDataWithFish[];
      });

      try {
        await groupService.getAverageTransparency('alpha')
      } catch (e) {
        expect(e.message).toMatch('No data in the group');
      }
    });
  });

  describe('getAverageTemperature', () => {
    it('should call getAverageTemperature if there is data', async () => {
      jest.spyOn(groupService, 'getLastGroupData').mockImplementation(async (name: string) => {
        return [{}] as SensorDataWithFish[];
      });
      const mocked = jest.spyOn(sensorService, 'getAverageTemperature');

      await groupService.getAverageTemperature('beta');

      expect(mocked.mock.calls).toHaveLength(1);
    });

    it('should return an error with no data', async () => {
      jest.spyOn(groupService, 'getLastGroupData').mockImplementation(async (name: string) => {
        return [] as SensorDataWithFish[];
      });

      try {
        await groupService.getAverageTemperature('alpha')
      } catch (e) {
        expect(e.message).toMatch('No data in the group');
      }
    });
  });

  describe('getLastSpecies', () => {
    it('should return a list of fish from 3 data', async () => {
      jest.spyOn(groupService, 'getLastGroupData').mockImplementation(async (name: string) => {
        return [{
          fish: [{
            name: FishEnum.ANCHOVY,
            amount: 10,
          }, {
            name: FishEnum.CRAPPIE,
            amount: 13
          }, {
            name: FishEnum.CARP,
            amount: 4
          }],
        }, {
          fish: [{
            name: FishEnum.SALMON,
            amount: 5,
          }, {
            name: FishEnum.CARP,
            amount: 8
          }],
        }, {
          fish: [{
            name: FishEnum.SALMON,
            amount: 2,
          }, {
            name: FishEnum.BLUEFISH,
            amount: 11
          }, {
            name: FishEnum.FLOUNDER,
            amount: 1
          }],
        }] as unknown as SensorDataWithFish[];
      });
      const result = [{
        name: FishEnum.ANCHOVY,
        amount: 10,
      }, {
        name: FishEnum.CRAPPIE,
        amount: 13,
      }, {
        name: FishEnum.CARP,
        amount: 8,
      }, {
        name: FishEnum.SALMON,
        amount: 5,
      }, {
        name: FishEnum.BLUEFISH,
        amount: 11,
      }, {
        name: FishEnum.FLOUNDER,
        amount: 1,
      }] as Fish[]

      const fish = await groupService.getLastSpecies('alpha');

      expect(fish).toEqual(result);
    });

    it('should return an empty list', async () => {
      jest.spyOn(groupService, 'getLastGroupData').mockImplementation(async (name: string) => {
        return [] as unknown as SensorDataWithFish[];
      });

      const fish = await groupService.getLastSpecies('alpha');

      expect(fish).toHaveLength(0);
    });
  });

  describe('getTopNSpecies', () => {
    it('should return a top 2 species from 3 data', async () => {
      jest.spyOn(groupService, 'getLastGroupData').mockImplementation(async (name: string) => {
        return [{
          fish: [{
            name: FishEnum.ANCHOVY,
            amount: 10,
          }, {
            name: FishEnum.CRAPPIE,
            amount: 13
          }, {
            name: FishEnum.CARP,
            amount: 4
          }],
        }, {
          fish: [{
            name: FishEnum.SALMON,
            amount: 5,
          }, {
            name: FishEnum.CARP,
            amount: 8
          }],
        }, {
          fish: [{
            name: FishEnum.SALMON,
            amount: 2,
          }, {
            name: FishEnum.BLUEFISH,
            amount: 11
          }, {
            name: FishEnum.FLOUNDER,
            amount: 1
          }],
        }] as unknown as SensorDataWithFish[];
      });
      const result = [{
        name: FishEnum.CRAPPIE,
        amount: 13,
      }, {
        name: FishEnum.BLUEFISH,
        amount: 11,
      }] as Fish[]

      const fish = await groupService.getTopNSpecies('alpha', 2);

      expect(fish).toEqual(result);
    });

    it('should return an empty list with any amount', async () => {
      jest.spyOn(groupService, 'getLastGroupData').mockImplementation(async (name: string) => {
        return [] as unknown as SensorDataWithFish[];
      });

      const fish = await groupService.getTopNSpecies('alpha', 2);
      const fish2 = await groupService.getTopNSpecies('alpha', 0);
      const fish3 = await groupService.getTopNSpecies('alpha', -5);

      expect(fish).toHaveLength(0);
      expect(fish2).toHaveLength(0);
      expect(fish3).toHaveLength(0);
    });
  });
});