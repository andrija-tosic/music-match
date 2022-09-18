import { User } from '@music-match/entities';
import { createAction, props } from '@ngrx/store';

export const loadUser = createAction(
  '[User] Init load user',
  props<{ id: number }>()
);

export const loadedUser = createAction(
  '[User] Loaded user',
  props<{ user: User }>()
);

export const setCurrentUserId = createAction(
  '[User] Current user ID set',
  props<{ id: number }>()
);

export const toggleUserFollowing = createAction(
  '[User] Init toggle user following',
  props<{ id: number }>()
);

export const toggledUserFollowing = createAction(
  '[User] Toggled user following'
);
