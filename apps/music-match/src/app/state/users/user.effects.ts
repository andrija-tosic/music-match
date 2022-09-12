import { UserService } from './../../services/user.service';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, map } from 'rxjs';
import * as UserActions from './user.action';

@Injectable()
export class UserEffects {
  constructor(private action$: Actions, private userService: UserService) {}

  loadUser$ = createEffect(() =>
    this.action$.pipe(
      ofType(UserActions.loadUser),
      switchMap(({ id }) =>
        this.userService
          .getUser(id)
          .pipe(map((user) => UserActions.loadUserSuccess({ user })))
      )
    )
  );
}
