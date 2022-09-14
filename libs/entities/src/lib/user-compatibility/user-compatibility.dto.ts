import { Artist, Genre } from '@music-match/entities';

export type UserCompatibilityDto = {
  withUserId: number;

  artistResults: (Pick<Artist, 'id' | 'imageUrl' | 'name'> & {
    occurences: number;
  })[];

  genreResults: (Pick<Genre, 'type'> & {
    occurences: number;
  })[];
};
