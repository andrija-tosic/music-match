import { PlaylistDto, PlaylistBaseDto } from '@music-match/entities';
import { createAction, props } from '@ngrx/store';

export const loadUserPlaylists = createAction('Load user playlists');
export const loadUserPlaylistsSuccess = createAction(
  'Load user playlists success',
  props<{ usersPlaylists: PlaylistBaseDto[]; usersLikedPlaylists: PlaylistBaseDto[] }>()
);
export const loadPlaylist = createAction('Load playlist', props<{ id: number }>());
export const loadPlaylistSuccess = createAction('Load playlist success', props<PlaylistDto>());

export const loadPlaylistWithTracks = createAction('Load playlist', props<{ id: number }>());
export const loadPlaylistWithTracksSuccess = createAction('Load playlist success', props<PlaylistDto>());
