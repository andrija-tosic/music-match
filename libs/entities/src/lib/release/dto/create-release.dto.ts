import { IsArray, IsNotEmpty } from 'class-validator';
import { CreateGenreDto } from '../../genre/dto/create-genre.dto';
import { Track } from '../../track/track.entity';
import { ReleaseType } from '../release-type';

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

  @IsArray()
  tracks: Pick<Track, 'name' | 'duration' | 'number'>[];

  @IsArray()
  genres: CreateGenreDto[];
}
