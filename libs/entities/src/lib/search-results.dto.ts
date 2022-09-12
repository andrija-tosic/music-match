import { Release } from './release/release.entity';
import { Artist } from './artist/artist.entity';
import { PlaylistBaseDto } from './playlist/dto/playlist-base.dto';
import { TrackDto } from './track/dto/track.dto';
import { User } from './user/user.entity';

export type SearchResultsDto = {
  query: string;
  artists: Artist[];
  releases: Omit<Release, 'tracks' | 'artists'>[];
  tracks: TrackDto[];
  users: User[];
  playlists: PlaylistBaseDto[];
};
