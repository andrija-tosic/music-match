import { AppState } from '../../app.state';
import { createSelector } from '@ngrx/store';
import { isNotUndefined } from '../../type-guards';

export const selectUserCompatibilities = createSelector(
  (state: AppState) => state.userCompatibilities,
  (userCompatibilities) => userCompatibilities
);

export const selectUserCompatibilityById = (id: number) =>
  createSelector(
    (state: AppState) => state.userCompatibilities,
    (userCompatibilities) => userCompatibilities.entities[id]
  );

export const selectUserCompatibilitiesByIds = (ids: number[]) =>
  createSelector(selectUserCompatibilities, (compatibilities) =>
    ids.map((id) => compatibilities.entities[id]).filter(isNotUndefined)
  );
