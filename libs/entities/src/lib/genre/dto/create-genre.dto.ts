import { IsNotEmpty } from 'class-validator';
import { GenreType } from '../genre-type';

export class CreateGenreDto {
  @IsNotEmpty()
  type: GenreType;
}
