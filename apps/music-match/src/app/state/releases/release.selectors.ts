import { AppState } from '../../app.state';
import { createSelector } from '@ngrx/store';

export const selectReleases = createSelector(
  (state: AppState) => state.releases,
  (releases) => releases
);
