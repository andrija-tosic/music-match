import { PlaylistDto, Release, User } from '@music-match/entities';

export type ReleaseEntity = Pick<
  Release,
  'id' | 'imageUrl' | 'name' | 'releaseDate' | 'type' | 'genres'
> & {
  artistIds: number[];
  trackIds: number[];
};

export type UserEntity = User & {
  likedPlaylistsIds: number[];
  playlistsIds: number[];
};

export class SearchEntity {
  query: string = '';
  artistIds: number[] = [];
  releaseIds: number[] = [];
  trackIds: number[] = [];
  userIds: number[] = [];
  playlistIds: number[] = [];
}

export type PlaylistEntity = Pick<
  PlaylistDto,
  'id' | 'description' | 'imageUrl' | 'liked' | 'name'
> & {
  ownerIds: number[];
  trackIds: number[];
};
