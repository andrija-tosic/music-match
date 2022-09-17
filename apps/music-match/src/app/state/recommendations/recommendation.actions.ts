import { RecommendationsDto } from '@music-match/entities';
import { createAction, props } from '@ngrx/store';

export const loadRecommendations = createAction(
  '[Recommendations] Init load recommendations'
);

export const loadedRecommendations = createAction(
  '[Recommendations] Loaded recommendations',
  props<{ recommendations: RecommendationsDto }>()
);
