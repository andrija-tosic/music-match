import { AppState } from '../../app.state';
import { createSelector } from '@ngrx/store';

export const selectArtists = createSelector(
  (state: AppState) => state.artists,
  (artists) => artists
);
