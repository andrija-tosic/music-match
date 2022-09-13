import { User } from '@music-match/entities';
import { createAction, props } from '@ngrx/store';

export const loadUser = createAction('Load user', props<{ id: number }>());

export const loadUserSuccess = createAction(
  'Init load user',
  props<{ user: User }>()
);

export const currentUserSet = createAction('Current user set', props<User>());

export const toggleUserFollowing = createAction(
  'Toggle user following',
  props<{ id: number }>()
);
