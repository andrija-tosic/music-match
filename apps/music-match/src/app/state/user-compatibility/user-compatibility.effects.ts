import { UserService } from '../../services/user.service';
import * as UserActions from '../users/user.action';
import * as UsersMusicMatchActions from './user-compatibility.actions';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap, map } from 'rxjs';

@Injectable()
export class UserMusicMatchEffects {
  constructor(private action$: Actions, private userService: UserService) {}

  getUserCompatibility$ = createEffect(() =>
    this.action$.pipe(
      ofType(UserActions.loadUser),
      mergeMap(({ id }) =>
        this.userService.getUserMusicMatch(id).pipe(
          map(({ artistResults, genreResults }) =>
            UsersMusicMatchActions.usersCompatibilityLoaded({
              userCompatibility: {
                withUserId: id,
                artistResults,
                genreResults,
              },
            })
          )
        )
      )
    )
  );
}
