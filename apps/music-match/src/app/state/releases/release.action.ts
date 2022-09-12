import { Release } from '@music-match/entities';
import { createAction, props } from '@ngrx/store';

export const loadRelease = createAction(
  'Load release',
  props<{ id: number }>()
);

export const loadReleaseSuccess = createAction(
  'Load release success',
  props<{ release: Release }>()
);
