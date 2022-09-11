import { IsNotEmpty, IsNotEmptyObject } from 'class-validator';
import { ReleaseType } from '../release-type';
import { Genre } from '../../genre/genre.entity';
import { Track } from '../../track/track.entity';

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
  tracks: Track[];

  @IsNotEmptyObject()
  genres: Genre[];
}
