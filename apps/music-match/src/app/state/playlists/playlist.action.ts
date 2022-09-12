import {
  PlaylistDto,
  PlaylistBaseDto,
  UpdatePlaylistDto,
  AddTrackDto,
  TrackDto,
  RemoveTrackDto,
  CreatePlaylistDto,
} from '@music-match/entities';
import { createAction, props } from '@ngrx/store';

export const loadUserPlaylists = createAction(
  'Load user playlists',
  props<{ id: number }>()
);

export const loadCurrentUserPlaylists = createAction(
  'Load current user playlists'
);

export const loadUserPlaylistsSuccess = createAction(
  'Load user playlists success',
  props<{
    usersPlaylists: PlaylistBaseDto[];
    usersLikedPlaylists: PlaylistBaseDto[];
  }>()
);
export const loadPlaylist = createAction(
  'Load playlist',
  props<{ id: number }>()
);
export const loadPlaylistSuccess = createAction(
  'Load playlist success',
  props<{ playlist: PlaylistDto }>()
);

export const loadPlaylistWithTracks = createAction(
  'Load playlist with tracks',
  props<{ id: number }>()
);
export const loadPlaylistWithTracksSuccess = createAction(
  'Load playlist with tracks success',
  props<{ playlist: PlaylistDto }>()
);

export const createPlaylist = createAction(
  'Create playlist',
  props<{ playlist: CreatePlaylistDto }>()
);

export const createPlaylistSuccess = createAction(
  'Create playlist success',
  props<{ playlist: PlaylistDto }>()
);
export const updateSelectedPlaylist = createAction(
  'Update selected playlist',
  props<{ playlist: UpdatePlaylistDto }>()
);
export const updateSelectedPlaylistSuccess = createAction(
  'Update playlist success',
  props<{ playlist: PlaylistDto }>()
);

export const deletePlaylist = createAction(
  'Delete playlist',
  props<{ id: number }>()
);

export const deletePlaylistSuccess = createAction('Delete playlist success');

export const addTracksToPlaylist = createAction(
  'Add tracks to playlist',
  props<{ id: number; tracksDto: AddTrackDto }>()
);
export const addTracksToPlaylistSuccess = createAction(
  'Add tracks to playlist success',
  props<{ tracks: TrackDto[] }>()
);

export const removeTracksFromPlaylist = createAction(
  'Remove tracks from playlist',
  props<{ id: number; removeTrackDto: RemoveTrackDto }>()
);
export const removeTracksFromPlaylistSuccess = createAction(
  'Remove tracks from playlist success',
  props<{ tracks: TrackDto[] }>()
);
