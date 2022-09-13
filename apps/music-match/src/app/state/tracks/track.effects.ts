import { TrackService } from './../../services/track.service';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, map, tap, mergeMap } from 'rxjs';
import * as TrackActions from './track.action';

@Injectable()
export class TrackEffects {
  constructor(private action$: Actions, private trackService: TrackService) {}

  toggleTrackLike$ = createEffect(() =>
    this.action$.pipe(
      ofType(TrackActions.toggleTrackLike),
      mergeMap(({ id }) =>
        this.trackService
          .toggleLike(id)
          .pipe(map((track) => TrackActions.toggledTrackLike({ track })))
      )
    )
  );
}
