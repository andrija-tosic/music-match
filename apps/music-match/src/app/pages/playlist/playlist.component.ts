import { AddToPlaylistFormDialogComponent } from './../../components/add-to-playlist-form-dialog/add-to-playlist-form-dialog.component';
import { PlaylistFormDialogComponent } from './../../components/playlist-form-dialog/playlist-form-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { PlaylistDto, TrackDto } from '@music-match/entities';
import { ActivatedRoute, Router } from '@angular/router';
import { selectedPlaylist } from '../../state/selectors';
import { filter, Observable, tap, switchMap, take } from 'rxjs';
import { AppState } from './../../app.state';
import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import {
  deletePlaylist,
  loadPlaylistWithTracks,
  removeTracksFromPlaylist,
} from '../../state/playlists/playlist.action';
import { isNotUndefined } from '../../type-guards';
import { toggleTrackLike } from '../../state/tracks/track.action';

@Component({
  selector: 'playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css'],
})
export class PlaylistComponent {
  playlist$: Observable<PlaylistDto>;

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.route.params.subscribe((params) => {
      this.store.dispatch(loadPlaylistWithTracks({ id: params['id'] }));
    });

    this.playlist$ = this.store
      .select(selectedPlaylist)
      .pipe(filter(isNotUndefined));
  }

  onRemoveTrack(trackNumber: number) {
    this.playlist$.pipe(take(1)).subscribe((playlist) => {
      this.store.dispatch(
        removeTracksFromPlaylist({
          id: playlist.id,
          removeTrackDto: { number: trackNumber },
        })
      );
    });
  }

  onToggleLike(trackId: number) {
    this.store.dispatch(toggleTrackLike({ id: trackId }));
  }

  onAddTrackToPlaylist(track: TrackDto) {
    const dialogRef = this.dialog.open(AddToPlaylistFormDialogComponent, {
      data: track,
    });
  }

  onAddCollaboratorToPlaylist() {
    const dialogRef = this.dialog.open(AddToPlaylistFormDialogComponent);
  }

  playlistOwnersName$() {
    return this.playlist$.pipe(
      switchMap((playlist) => playlist.owners.map((owner) => owner.name))
    );
  }

  openPlaylistFormDialog(actionType: 'Create' | 'Update') {
    const dialogRef = this.dialog.open(PlaylistFormDialogComponent, {
      data: actionType,
    });
  }

  deletePlaylist() {
    this.playlist$.pipe(take(1)).subscribe((playlist) => {
      this.store.dispatch(deletePlaylist({ id: playlist.id }));

      this.router.navigate(['/home']);
    });
  }

  toggleLike() {}
}
