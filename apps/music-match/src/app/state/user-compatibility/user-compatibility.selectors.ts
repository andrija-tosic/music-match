import { AppState } from '../../app.state';
import { createSelector } from '@ngrx/store';

export const selectUserCompatibilities = createSelector(
  (state: AppState) => state.userCompatibilities,
  (userCompatibilities) => userCompatibilities
);

export const selectUserCompatibilityById = (id: number) =>
  createSelector(
    (state: AppState) => state.userCompatibilities,
    (userCompatibilities) => userCompatibilities.entities[id]
  );
