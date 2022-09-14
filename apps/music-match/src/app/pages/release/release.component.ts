import { MatDialog } from '@angular/material/dialog';
import { AddToPlaylistFormDialogComponent } from './../../components/add-to-playlist-form-dialog/add-to-playlist-form-dialog.component';
import { toggleTrackLike } from './../../state/tracks/track.action';
import { selectedRelease } from './../../state/selectors';
import { loadRelease } from './../../state/releases/release.action';
import { filter, map, Observable, tap, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AppState } from '../../app.state';
import { ReleaseDto, TrackDto } from '@music-match/entities';
import { isNotUndefined } from '../../type-guards';

@Component({
  selector: 'release',
  templateUrl: './release.component.html',
  styleUrls: ['./release.component.css'],
})
export class ReleaseComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private dialog: MatDialog
  ) {}

  release$: Observable<ReleaseDto>;

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'];

      this.store.dispatch(loadRelease({ id }));

      this.release$ = this.store
        .select(selectedRelease)
        .pipe(filter(isNotUndefined));
    });
  }

  getArtistImages() {
    return this.release$.pipe(
      map((release) => release.artists.map(({ imageUrl }) => imageUrl))
    );
  }

  getArtistNames() {
    return this.release$.pipe(
      map((release) => release.artists.map(({ name }) => name))
    );
  }

  getGenreTypes() {
    return this.release$.pipe(
      map((release) =>
        release.genres
          .map(({ type }) =>
            type
              .split('')
              .map((w) => w[0].toUpperCase() + w.substring(1))
              .join('')
          )
          .join(', ')
      )
    );
  }

  onToggleTrackLike(trackId: number) {
    this.store.dispatch(toggleTrackLike({ id: trackId }));
  }

  onAddTrackToPlaylist(track: TrackDto) {
    console.log('addtrack');

    const dialogRef = this.dialog.open(AddToPlaylistFormDialogComponent, {
      data: track,
    });
  }

  openReleaseFormDialog(type: 'Create' | 'Update') {}

  deleteRelease() {}
}
