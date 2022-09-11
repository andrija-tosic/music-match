import { AppState } from './../../app.state';
import { createSelector } from '@ngrx/store';

export const selectPlaylists = createSelector(
  (state: AppState) => state.playlists,
  (playlists) => playlists
);

export const selectUserPlaylists = createSelector(selectPlaylists, (playlists) => {
  return { usersPlaylists: playlists.usersPlaylists, usersLikedPlaylists: playlists.usersLikedPlaylists };
});

export const selectedPlaylist = createSelector(selectPlaylists, (playlists) => playlists.selectedPlaylist);
