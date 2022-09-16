import {
  PlaylistDto,
  PlaylistBaseDto,
  UpdatePlaylistDto,
  AddTrackDto,
  TrackDto,
  RemoveTrackDto,
  CreatePlaylistDto,
  ChangeTrackPositionDto,
} from '@music-match/entities';
import { createAction, props } from '@ngrx/store';

export const loadUserPlaylists = createAction(
  '[Playlist] Init load user playlists',
  props<{ id: number }>()
);

export const loadCurrentUserPlaylists = createAction(
  '[Playlist] Init load current user playlists'
);

export const loadedUserPlaylists = createAction(
  '[Playlist] Loaded user playlists',
  props<{
    usersPlaylists: PlaylistBaseDto[];
    usersLikedPlaylists: PlaylistBaseDto[];
  }>()
);

export const loadPlaylistWithTracks = createAction(
  '[Playlist] Init load playlist with tracks',
  props<{ id: number }>()
);
export const loadedPlaylistWithTracks = createAction(
  '[Playlist] Loaded playlist with tracks',
  props<{ playlist: PlaylistDto }>()
);

export const createPlaylist = createAction(
  '[Playlist] Init create playlist',
  props<{ playlist: CreatePlaylistDto }>()
);

export const createdPlaylist = createAction(
  '[Playlist] Created playlist',
  props<{ playlist: PlaylistDto }>()
);
export const updateSelectedPlaylist = createAction(
  '[Playlist] Init update selected playlist',
  props<{ playlist: UpdatePlaylistDto }>()
);
export const updatedSelectedPlaylist = createAction(
  '[Playlist] Updated playlist',
  props<{ playlist: PlaylistDto }>()
);

export const deletePlaylist = createAction(
  '[Playlist] Delete playlist',
  props<{ id: number }>()
);

export const deletedPlaylist = createAction('[Playlist] Deleted playlist');

export const addTracksToPlaylist = createAction(
  '[Playlist] Init add tracks to playlist',
  props<{ id: number; tracksDto: AddTrackDto }>()
);
export const addedTracksToPlaylist = createAction(
  '[Playlist] Added tracks to playlist',
  props<{ tracks: TrackDto[] }>()
);

export const removeTracksFromPlaylist = createAction(
  '[Playlist] Init remove tracks from playlist',
  props<{ id: number; removeTrackDto: RemoveTrackDto }>()
);
export const removedTracksFromPlaylist = createAction(
  '[Playlist] Removed tracks from playlist',
  props<{ tracks: TrackDto[] }>()
);

export const addCollaboratorToPlaylist = createAction(
  '[Playlist] Init add collaborator to playlist',
  props<{ playlistId: number; userId: number }>()
);

export const addedCollaboratorToPlaylist = createAction(
  '[Playlist] Added collaborator to playlist',
  props<{ playlist: PlaylistDto }>()
);

export const removeCollaboratorFromPlaylist = createAction(
  '[Playlist] Init remove collaborator from playlist',
  props<{ playlistId: number; userId: number }>()
);

export const removedCollaboratorFromPlaylist = createAction(
  '[Playlist] Removed collaborator from playlist'
);

export const changeTrackPosition = createAction(
  '[Playlist] Init change track position',
  props<
    {
      playlistId: number;
    } & ChangeTrackPositionDto
  >()
);

export const changedTrackPosition = createAction(
  '[Playlist] Changed track position'
);
