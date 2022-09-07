import { GenreInReleaseDto } from './genre-in-release.dto';
import { TrackInReleaseDto } from './track-in-release.dto';
import { ArtistInReleaseDto } from './artist-in-release.dto';
import { IsNotEmpty, IsNotEmptyObject } from 'class-validator';
import { ReleaseType } from '../release-type';
import { Artist } from '../../artist/artist.entity';
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
