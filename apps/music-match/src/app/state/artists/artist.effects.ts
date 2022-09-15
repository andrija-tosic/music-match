import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { switchMap, map } from 'rxjs';
import { AppState } from '../../app.state';
import { PlaylistService } from '../../services/playlist.service';
import * as ReleaseActions from '../releases/release.actions';

@Injectable()
export class ArtistsEffects {
  constructor(private action$: Actions, private store: Store<AppState>) {}
}
