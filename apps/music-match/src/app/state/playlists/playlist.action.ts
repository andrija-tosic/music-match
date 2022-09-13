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
  'Init load user playlists',
  props<{ id: number }>()
);

export const loadCurrentUserPlaylists = createAction(
  'Init load current user playlists'
);

export const loadedUserPlaylists = createAction(
  'Loaded user playlists',
  props<{
    usersPlaylists: PlaylistBaseDto[];
    usersLikedPlaylists: PlaylistBaseDto[];
  }>()
);
export const loadPlaylist = createAction(
  'Init load playlist',
  props<{ id: number }>()
);
export const loadedPlaylist = createAction(
  'Loaded playlist',
  props<{ playlist: PlaylistDto }>()
);

export const loadPlaylistWithTracks = createAction(
  'Init load playlist with tracks',
  props<{ id: number }>()
);
export const loadedPlaylistWithTracks = createAction(
  'Loaded playlist with tracks',
  props<{ playlist: PlaylistDto }>()
);

export const createPlaylist = createAction(
  'Init create playlist',
  props<{ playlist: CreatePlaylistDto }>()
);

export const createdPlaylist = createAction(
  'Created playlist',
  props<{ playlist: PlaylistDto }>()
);
export const updateSelectedPlaylist = createAction(
  'Init update selected playlist',
  props<{ playlist: UpdatePlaylistDto }>()
);
export const updatedSelectedPlaylist = createAction(
  'Updated playlist',
  props<{ playlist: PlaylistDto }>()
);

export const deletePlaylist = createAction(
  'Deleted playlist',
  props<{ id: number }>()
);

export const deletedPlaylist = createAction('Delete playlist success');

export const addTracksToPlaylist = createAction(
  'Init add tracks to playlist',
  props<{ id: number; tracksDto: AddTrackDto }>()
);
export const addedTracksToPlaylist = createAction(
  'Added tracks to playlist',
  props<{ tracks: TrackDto[] }>()
);

export const removeTracksFromPlaylist = createAction(
  'Init remove tracks from playlist',
  props<{ id: number; removeTrackDto: RemoveTrackDto }>()
);
export const removedTracksFromPlaylist = createAction(
  'Removed tracks from playlist',
  props<{ tracks: TrackDto[] }>()
);
