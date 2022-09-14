import { User } from '@music-match/entities';
import { createAction, props } from '@ngrx/store';

export const loadUser = createAction('Init load user', props<{ id: number }>());

export const loadedUser = createAction('Loaded user', props<{ user: User }>());

export const currentUserSet = createAction('Current user set', props<User>());

export const toggleUserFollowing = createAction(
  'Toggle user following',
  props<{ id: number }>()
);
