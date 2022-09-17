import { UserCompatibilityDto } from '@music-match/entities';
import { createAction, props } from '@ngrx/store';

export const loadUserCompatibility = createAction(
  '[UsersCompatibility] Load user compatibility',
  props<{ id: number }>()
);

export const usersCompatibilityLoaded = createAction(
  '[UsersCompatibility] Users compatibility loaded',
  props<{ userCompatibility: UserCompatibilityDto }>()
);
