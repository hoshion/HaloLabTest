import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { GroupService } from '../services/GroupService';

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
  ) {
    return this.groupService.getAverageTransparency(name);
  }

  @Get('/:groupName/temperature/average')
  async getAverageTemperature(
    @Param('groupName') name: string,
  ) {
    return this.groupService.getAverageTemperature(name);
  }

  @Get('/:groupName/species')
  async getLastSpecies(
    @Param('groupName') name: string,
  ) {
    return this.groupService.getLastSpecies(name);
  }

  @Get('/:groupName/species/top/:amount')
  async getTopNSpecies(
    @Param('groupName') name: string,
    @Param('amount', ParseIntPipe) amount: number,
  ) {
    return this.groupService.getTopNSpecies(name, amount);
  }

}