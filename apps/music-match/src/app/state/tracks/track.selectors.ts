import { AppState } from '../../app.state';
import { createSelector } from '@ngrx/store';

export const selectTracks = createSelector(
  (state: AppState) => state.tracks,
  (tracks) => tracks
);
