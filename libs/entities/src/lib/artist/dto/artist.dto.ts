import { ReleaseEntity } from '@music-match/state-entities';

import { Artist } from '@music-match/entities';

export type ArtistDto = Pick<Artist, 'id' | 'imageUrl' | 'name'> & {
  releases: ReleaseEntity[];
};
