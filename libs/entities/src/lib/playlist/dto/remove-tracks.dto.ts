import { IsNotEmptyObject } from 'class-validator';

export class RemoveTrackDto {
  @IsNotEmptyObject()
  number: number;
}
