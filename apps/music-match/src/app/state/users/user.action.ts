import { User } from '@music-match/entities';
import { createAction, props } from '@ngrx/store';

export const loadUser = createAction('Load user', props<{ id: number }>());

export const loadUserSuccess = createAction(
  'Load user success',
  props<{ user: User }>()
);

export const setCurrentUserSuccess = createAction(
  'Set current user success',
  props<User>()
);
