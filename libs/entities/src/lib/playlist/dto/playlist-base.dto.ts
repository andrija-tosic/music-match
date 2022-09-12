import { Playlist } from '@music-match/entities';
export type PlaylistBaseDto = Pick<Playlist, 'id' | 'name' | 'imageUrl'>;
