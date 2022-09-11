import { IsNotEmptyObject } from 'class-validator';

export class AddTracksDto {
  @IsNotEmptyObject()
  trackIds: number[];
}
