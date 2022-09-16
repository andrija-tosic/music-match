import { PlaylistEntity, UserEntity } from '@music-match/state-entities';

export type UserViewModel = UserEntity & {
  playlists: PlaylistEntity[];
  likedPlaylists: PlaylistEntity[];
};
