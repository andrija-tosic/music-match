import { UserService } from './../../services/user.service';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, map, tap } from 'rxjs';
import * as UserActions from './user.actions';

@Injectable()
export class UserEffects {
  constructor(private action$: Actions, private userService: UserService) {}

  loadUser$ = createEffect(() =>
    this.action$.pipe(
      ofType(UserActions.loadUser),
      tap(() => console.log('[Effect] UserActions.loadUser')),
      switchMap(({ id }) =>
        this.userService
          .getUser(id)
          .pipe(map((user) => UserActions.loadedUser({ user })))
      )
    )
  );
}
