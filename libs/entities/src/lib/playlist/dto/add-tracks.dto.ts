import { IsNotEmpty, IsNotEmptyObject } from 'class-validator';

export class AddTracksDto {
  @IsNotEmpty()
  position: number;

  @IsNotEmptyObject()
  trackIds: number[];
}
