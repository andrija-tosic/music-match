import {
  CreateReleaseDto,
  Release,
  ReleaseDto,
  UpdateReleaseDto,
} from '@music-match/entities';
import { createAction, props } from '@ngrx/store';

export const loadRelease = createAction(
  '[Release] Init load release',
  props<{ id: number }>()
);

export const loadedRelease = createAction(
  '[Release] Loaded release',
  props<{ release: ReleaseDto }>()
);

export const createRelease = createAction(
  '[Release] Init create release',
  props<{ release: CreateReleaseDto }>()
);

export const createdRelease = createAction(
  '[Release] Created release',
  props<{ release: Release }>()
);

export const updateRelease = createAction(
  '[Release] Init update Release',
  props<{ id: number; release: UpdateReleaseDto }>()
);

export const updatedRelease = createAction(
  '[Release] Updated release',
  props<{ release: ReleaseDto }>()
);

export const deleteRelease = createAction(
  '[Release] Init delete release',
  props<{ id: number }>()
);

export const deletedRelease = createAction('[Release] Deleted release');
