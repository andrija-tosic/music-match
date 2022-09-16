import { IsNotEmpty, IsNotEmptyObject } from 'class-validator';
import { ReleaseType } from '../release-type';
import { Track } from '../../track/track.entity';
import { GenreType } from '../../genre/genre-type';
import { CreateGenreDto } from '../../genre/dto/create-genre.dto';

export class CreateReleaseDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  releaseDate: string;

  imageUrl: string;

  @IsNotEmpty()
  type: ReleaseType;

  @IsNotEmpty()
  artistIds: number[];

  @IsNotEmptyObject()
  tracks: Pick<Track, 'name' | 'duration' | 'number'>[];

  @IsNotEmptyObject()
  genres: CreateGenreDto[];
}
