import { Release, TrackDto } from '@music-match/entities';
import { ArtistEntity } from '@music-match/state-entities';

export type ReleaseDto = Omit<Release, 'tracks' | 'artists'> & {
  tracks: TrackDto[];
  artists: ArtistEntity[];
};
