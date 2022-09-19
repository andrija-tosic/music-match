import { AppState } from '../../app.state';
import { createSelector } from '@ngrx/store';

export const selectPlaylists = createSelector(
  (state: AppState) => state.playlists,
  (playlists) => playlists
);
