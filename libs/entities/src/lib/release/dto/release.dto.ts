import { Release, TrackDto } from '@music-match/entities';

export type ReleaseDto = Omit<Release, 'tracks'> & {
  tracks: TrackDto[];
};
