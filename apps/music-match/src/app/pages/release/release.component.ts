import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ReleaseDto, TrackDto } from '@music-match/entities';
import { PlaylistEntity, UserEntity } from '@music-match/state-entities';
import { Store } from '@ngrx/store';
import { filter, map, Observable } from 'rxjs';
import { AppState } from '../../app.state';
import { ReleaseFormDialogComponent } from '../../components/release-form-dialog/release-form-dialog.component';
import { addTracksToPlaylist } from '../../state/playlists/playlist.actions';
import {
  deleteRelease,
  loadRelease,
} from '../../state/releases/release.actions';
import { toggleTrackLike } from '../../state/tracks/track.actions';
import { selectCurrentUser } from '../../state/users/user.selectors';
import { isNotUndefined } from '../../type-guards';
import { AddToPlaylistFormDialogComponent } from '../../components/add-to-playlist-form-dialog/add-to-playlist-form-dialog.component';
import { selectedRelease } from '../../state/selectors';

@Component({
  selector: 'release',
  templateUrl: './release.component.html',
  styleUrls: ['./release.component.css'],
})
export class ReleaseComponent {
  release$: Observable<ReleaseDto>;
  currentUser$: Observable<UserEntity>;

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.route.params.subscribe((params) => {
      const id = params['id'];

      this.store.dispatch(loadRelease({ id }));

      this.release$ = this.store
        .select(selectedRelease)
        .pipe(filter(isNotUndefined));

      this.currentUser$ = this.store
        .select(selectCurrentUser)
        .pipe(filter(isNotUndefined));
    });
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

  openReleaseFormDialog(type: 'Create' | 'Update', release: ReleaseDto) {
    this.dialog.open(ReleaseFormDialogComponent, {
      data: { actionType: type, release },
    });
  }

  dispatchDeleteRelease(release: ReleaseDto) {
    this.store.dispatch(deleteRelease(release));
    this.router.navigate(['/home']);
  }
}
