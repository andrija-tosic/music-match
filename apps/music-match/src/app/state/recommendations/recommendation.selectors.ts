import { AppState } from '../../app.state';
import { createSelector } from '@ngrx/store';

export const selectRecommendations = createSelector(
  (state: AppState) => state.recommendations,
  (recommendations) => recommendations
);
