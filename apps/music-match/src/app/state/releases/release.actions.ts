import { Release, ReleaseDto } from '@music-match/entities';
import { createAction, props } from '@ngrx/store';

export const loadRelease = createAction(
  '[Release] Init load release',
  props<{ id: number }>()
);

export const loadedRelease = createAction(
  '[Release] Loaded release',
  props<{ release: ReleaseDto }>()
);
