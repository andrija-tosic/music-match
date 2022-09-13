import { ReleaseService } from './../../services/release.service';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, map, tap, mergeMap } from 'rxjs';
import * as ReleaseActions from './release.action';

@Injectable()
export class ReleaseEffects {
  constructor(
    private action$: Actions,
    private releaseService: ReleaseService
  ) {}

  loadRelease$ = createEffect(() =>
    this.action$.pipe(
      ofType(ReleaseActions.loadRelease),
      mergeMap(({ id }) =>
        this.releaseService
          .getRelease(id)
          .pipe(map((release) => ReleaseActions.loadedRelease({ release })))
      )
    )
  );
}
