import { AppState } from '../../app.state';
import { createSelector } from '@ngrx/store';
import { isNotUndefined } from '../../type-guards';

export const selectReleases = createSelector(
  (state: AppState) => state.releases,
  (releases) => releases
);

export const selectReleaseById = (id: number) =>
  createSelector(selectReleases, (releases) => releases.entities[id]);

export const selectReleasesByIds = (ids: number[]) =>
  createSelector(selectReleases, (releases) =>
    ids.map((id) => releases.entities[id]).filter(isNotUndefined)
  );
