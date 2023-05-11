import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class Region {

  @Type(() => Number)
  @IsNotEmpty()
  xMin: number;

  @Type(() => Number)
  @IsNotEmpty()
  xMax: number;

  @Type(() => Number)
  @IsNotEmpty()
  yMin: number;

  @Type(() => Number)
  @IsNotEmpty()
  yMax: number;

  @Type(() => Number)
  @IsNotEmpty()
  zMin: number;

  @Type(() => Number)
  @IsNotEmpty()
  zMax: number;
}