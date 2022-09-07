import { IsNotEmpty } from 'class-validator';

export class TrackInReleaseDto {
  id: number;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  number: number;

  @IsNotEmpty()
  duration: number;

  @IsNotEmpty()
  danceability: number;
  @IsNotEmpty()
  energy: number;
  @IsNotEmpty()
  key: number;
  @IsNotEmpty()
  loudness: number;
  @IsNotEmpty()
  mode: number;
  @IsNotEmpty()
  speechiness: number;
  @IsNotEmpty()
  acousticness: number;
  @IsNotEmpty()
  instrumentalness: number;
  @IsNotEmpty()
  liveness: number;
  @IsNotEmpty()
  valence: number;
  @IsNotEmpty()
  tempo: number;
}
