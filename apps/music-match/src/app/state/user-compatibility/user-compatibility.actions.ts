import { UserCompatibilityDto } from '@music-match/entities';
import { createAction, props } from '@ngrx/store';

export const loadUserCompatibility = createAction(
  '[User] Load user compatibility',
  props<{ id: number }>()
);

export const usersCompatibilityLoaded = createAction(
  '[UsersCompatibility] Users compatibility loaded',
  props<{ userCompatibility: UserCompatibilityDto }>()
);
