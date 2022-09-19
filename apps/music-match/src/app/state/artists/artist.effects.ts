import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, first, map, switchMap } from 'rxjs';
import { AppState } from '../../app.state';
import { ArtistService } from '../../services/artist.service';
import { isNotUndefined } from '../../type-guards';
import { selectedArtist } from '../selectors';
import * as ArtistActions from './artist.actions';

@Injectable()
export class ArtistsEffects {
  loadArtistWithReleases$ = createEffect(() =>
    this.action$.pipe(
      ofType(ArtistActions.loadArtistWithReleases),
      switchMap(({ id }) =>
        this.artistService
          .getArtistWithReleases(id)
          .pipe(
            map((artist) => ArtistActions.loadedArtistWithReleases({ artist }))
          )
      )
    )
  );
  createArtist$ = createEffect(() =>
    this.action$.pipe(
      ofType(ArtistActions.createArtist),
      switchMap(({ artist }) =>
        this.artistService
          .createArtist(artist)
          .pipe(map((artist) => ArtistActions.createdArtist({ artist })))
      )
    )
  );

  updateSelectedArtist$ = createEffect(() =>
    this.action$.pipe(
      ofType(ArtistActions.updateSelectedArtist),
      switchMap(({ artist }) =>
        this.store.select(selectedArtist).pipe(
          filter(isNotUndefined),
          first(),
          switchMap((oldArtist) =>
            this.artistService
              .updateArtist(oldArtist.id, artist)
              .pipe(
                map((artist) => ArtistActions.updatedSelectedArtist({ artist }))
              )
          )
        )
      )
    )
  );
  deleteArtist$ = createEffect(() =>
    this.action$.pipe(
      ofType(ArtistActions.deleteArtist),
      switchMap(({ id }) =>
        this.artistService
          .deleteArtist(id)
          .pipe(map(() => ArtistActions.deletedArtist()))
      )
    )
  );

  constructor(
    private action$: Actions,
    private artistService: ArtistService,
    private router: Router,
    private store: Store<AppState>
  ) {}
}
