import { PlaylistBaseDto, PlaylistDto, TrackDto } from '@music-match/entities';
import * as Actions from './playlist.action';
import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';

export interface PlaylistsState extends EntityState<PlaylistDto> {
  usersPlaylists: PlaylistBaseDto[];
  usersLikedPlaylists: PlaylistBaseDto[];
  selectedPlaylist: PlaylistDto;
}

const playlistAdapter = createEntityAdapter<PlaylistDto>();

export const initialState: PlaylistsState = playlistAdapter.getInitialState({
  selectedPlaylist: { id: -1, description: '', name: '', imageUrl: '', owners: [], tracks: [] },
  usersPlaylists: [],
  usersLikedPlaylists: [],
});

export const playlistReducer = createReducer(
  initialState,
  on(Actions.loadPlaylistWithTracksSuccess, (state, playlist) => {
    return {
      ...state,
      selectedPlaylist: playlist,
    };
  }),
  on(Actions.loadUserPlaylistsSuccess, (state, { usersPlaylists, usersLikedPlaylists }) => {
    return {
      ...state,
      usersPlaylists,
      usersLikedPlaylists,
    };
  })
);
