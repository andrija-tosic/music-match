import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs';
import { UserService } from '../../services/user.service';
import * as UserActions from './user.actions';

@Injectable()
export class UserEffects {
  loadUser$ = createEffect(() =>
    this.action$.pipe(
      ofType(UserActions.loadUser),
      switchMap(({ id }) =>
        this.userService
          .getUser(id)
          .pipe(map((user) => UserActions.loadedUser({ user })))
      )
    )
  );
  toggleUserFollowing$ = createEffect(() =>
    this.action$.pipe(
      ofType(UserActions.toggleUserFollowing),
      switchMap(({ id }) =>
        this.userService
          .toggleUserFollowing(id)
          .pipe(map(() => UserActions.toggledUserFollowing()))
      )
    )
  );

  constructor(private action$: Actions, private userService: UserService) {}
}
