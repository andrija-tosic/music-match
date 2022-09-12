import { Release } from '../../release/release.entity';
import { Track } from '../track.entity';

export type TrackDto = Pick<Track, 'id' | 'name' | 'number' | 'duration'> & {
  release: Pick<Release, 'id' | 'name' | 'artists' | 'imageUrl'>;
  liked: boolean;
};
