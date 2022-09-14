import { UserCompatibilityDto } from '@music-match/entities';
import { createAction, props } from '@ngrx/store';

export const usersCompatibilityLoaded = createAction(
  'Users compatibility loaded',
  props<{ userCompatibility: UserCompatibilityDto }>()
);
