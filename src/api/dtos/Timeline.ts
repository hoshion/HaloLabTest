import { Type } from 'class-transformer';

export class Timeline {
  @Type(() => Date)
  from: Date;

  @Type(() => Date)
  till: Date;
}