import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class AddTrackDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  trackId: number;
}
