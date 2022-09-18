import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class RemoveTrackDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  number: number;
}
