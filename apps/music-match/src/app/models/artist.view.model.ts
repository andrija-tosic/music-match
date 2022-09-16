import { Artist } from '@music-match/entities';
import { ReleaseEntity } from '@music-match/state-entities';

export type ArtistViewModel = Pick<Artist, 'id' | 'imageUrl' | 'name'> & {
  releases: ReleaseEntity[];
};
