import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { GroupService } from '../services/GroupService';
import { Fish } from '@prisma/client';

@Controller({
  path: '/group'
})
export class GroupController {
  constructor (
    private groupService: GroupService,
  ) {}

  @Get('/:groupName/transparency/average')
  async getAverageTransparency(
    @Param('groupName') name: string,
  ): Promise<number> {
    return this.groupService.getAverageTransparency(name);
  }

  @Get('/:groupName/temperature/average')
  async getAverageTemperature(
    @Param('groupName') name: string,
  ): Promise<number> {
    return this.groupService.getAverageTemperature(name);
  }

  @Get('/:groupName/species')
  async getLastSpecies(
    @Param('groupName') name: string,
  ): Promise<Fish[]> {
    return this.groupService.getLastSpecies(name);
  }

  @Get('/:groupName/species/top/:amount')
  async getTopNSpecies(
    @Param('groupName') name: string,
    @Param('amount', ParseIntPipe) amount: number,
  ): Promise<Fish[]> {
    return this.groupService.getTopNSpecies(name, amount);
  }

}