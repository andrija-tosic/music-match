import { TrackDto } from './../../track/dto/track.dto';
import { User } from '../../user/user.entity';
import { Playlist } from '../playlist.entity';
import { PlaylistBaseDto } from './playlist-base.dto';

export type PlaylistDto = PlaylistBaseDto &
  Pick<Playlist, 'description' | 'imageUrl'> & {
    owners: Pick<User, 'id' | 'name'>[];
    tracks: TrackDto[];
    liked: boolean;
  };
