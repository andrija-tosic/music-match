import { ReleaseService } from '../../services/release.service';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap, switchMap, tap } from 'rxjs';
import * as ReleaseActions from './release.actions';
import { Router } from '@angular/router';

@Injectable()
export class ReleaseEffects {
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
  createRelease$ = createEffect(() =>
    this.action$.pipe(
      ofType(ReleaseActions.createRelease),
      switchMap(({ release }) =>
        this.releaseService
          .createRelease(release)
          .pipe(map((release) => ReleaseActions.createdRelease({ release })))
      )
    )
  );
  navigateToCreatedRelease$ = createEffect(
    () =>
      this.action$.pipe(
        ofType(ReleaseActions.createdRelease),
        tap(({ release }) => this.router.navigate(['/release/' + release.id]))
      ),
    { dispatch: false }
  );
  updateRelease$ = createEffect(() =>
    this.action$.pipe(
      ofType(ReleaseActions.updateRelease),
      switchMap(({ id, release }) =>
        this.releaseService
          .updateRelease(id, release)
          .pipe(map((release) => ReleaseActions.updatedRelease({ release })))
      )
    )
  );
  deleteRelease$ = createEffect(() =>
    this.action$.pipe(
      ofType(ReleaseActions.deleteRelease),
      switchMap(({ id }) =>
        this.releaseService
          .deleteRelease(id)
          .pipe(map(() => ReleaseActions.deletedRelease()))
      )
    )
  );

  constructor(
    private action$: Actions,
    private releaseService: ReleaseService,
    private router: Router
  ) {}
}
