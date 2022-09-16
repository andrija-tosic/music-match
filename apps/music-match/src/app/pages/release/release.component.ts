import { MatDialog } from '@angular/material/dialog';
import { AddToPlaylistFormDialogComponent } from './../../components/add-to-playlist-form-dialog/add-to-playlist-form-dialog.component';
import { toggleTrackLike } from '../../state/tracks/track.actions';
import { selectedRelease } from './../../state/selectors';
import {
  deleteRelease,
  loadRelease,
} from '../../state/releases/release.actions';
import { filter, map, Observable, tap, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AppState } from '../../app.state';
import { ReleaseDto, TrackDto } from '@music-match/entities';
import { isNotUndefined } from '../../type-guards';
import { addTracksToPlaylist } from '../../state/playlists/playlist.actions';
import { PlaylistEntity } from '@music-match/state-entities';

@Component({
  selector: 'release',
  templateUrl: './release.component.html',
  styleUrls: ['./release.component.css'],
})
export class ReleaseComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private dialog: MatDialog,
    private router: Router
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
              .toString()
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
    const dialogRef = this.dialog.open(AddToPlaylistFormDialogComponent, {
      data: track,
    });

    dialogRef
      .afterClosed()
      .subscribe((playlist: PlaylistEntity | undefined) => {
        if (playlist) {
          this.store.dispatch(
            addTracksToPlaylist({
              id: playlist.id,
              tracksDto: { trackId: track.id },
            })
          );
        }
      });
  }

  openReleaseFormDialog(type: 'Create' | 'Update') {}

  dispatchDeleteRelease(release: ReleaseDto) {
    this.store.dispatch(deleteRelease(release));
    this.router.navigate(['/home']);
  }
}
