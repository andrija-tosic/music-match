import { CreateGenreDto } from './../../genre/dto/create-genre.dto';
import { IsNotEmpty } from 'class-validator';
import { GenreType } from '../../genre/genre-type';

export class GenreInReleaseDto extends CreateGenreDto {
  id: number;
}
