import { IsNotEmptyObject } from 'class-validator';

export class AddTrackDto {
  @IsNotEmptyObject()
  trackId: number;
}
