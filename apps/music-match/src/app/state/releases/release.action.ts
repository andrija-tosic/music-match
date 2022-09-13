import { Release, ReleaseDto } from '@music-match/entities';
import { createAction, props } from '@ngrx/store';

export const loadRelease = createAction(
  'Init load release',
  props<{ id: number }>()
);

export const loadedRelease = createAction(
  'Loaded release',
  props<{ release: ReleaseDto }>()
);
