import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class ChangeTrackPositionDto {
  @IsNotEmpty()
  @Min(0)
  @IsNumber()
  fromIndex: number;

  @IsNotEmpty()
  @IsNumber()
  toIndex: number;
}
