import { UserService } from '../../services/user.service';
import * as UserCompatibilityActions from '../user-compatibility/user-compatibility.actions';
import * as UsersMusicMatchActions from './user-compatibility.actions';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap, map } from 'rxjs';

@Injectable()
export class UserMusicMatchEffects {
  constructor(private action$: Actions, private userService: UserService) {}

  getUserCompatibility$ = createEffect(() =>
    this.action$.pipe(
      ofType(UserCompatibilityActions.loadUserCompatibility),
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
