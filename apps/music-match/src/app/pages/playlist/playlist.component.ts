import { AddToPlaylistFormDialogComponent } from './../../components/add-to-playlist-form-dialog/add-to-playlist-form-dialog.component';
import { PlaylistFormDialogComponent } from './../../components/playlist-form-dialog/playlist-form-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import {
  ChangeTrackPositionDto,
  PlaylistDto,
  TrackDto,
  User,
} from '@music-match/entities';
import { ActivatedRoute, Router } from '@angular/router';
import { selectedPlaylist } from '../../state/selectors';
import {
  filter,
  Observable,
  tap,
  switchMap,
  take,
  mergeMap,
  combineLatest,
} from 'rxjs';
import { AppState } from './../../app.state';
import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import {
  addCollaboratorToPlaylist,
  addTracksToPlaylist,
  changeTrackPosition,
  deletePlaylist,
  loadPlaylistWithTracks,
  removeCollaboratorFromPlaylist,
  removeTracksFromPlaylist,
} from '../../state/playlists/playlist.actions';
import { isNotUndefined } from '../../type-guards';
import { toggleTrackLike } from '../../state/tracks/track.actions';
import { PlaylistEntity, UserEntity } from '@music-match/state-entities';
import { AddCollaboratorFormDialogComponent } from '../../components/add-collaborator-form-dialog/add-collaborator-form-dialog.component';
import { selectCurrentUser } from '../../state/users/user.selectors';

@Component({
  selector: 'playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css'],
})
export class PlaylistComponent {
  playlist$: Observable<PlaylistDto>;
  currentUser$: Observable<UserEntity>;

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

    this.currentUser$ = this.store
      .select(selectCurrentUser)
      .pipe(filter(isNotUndefined));
  }

  onRemoveTrack(trackNumber: number, playlist: PlaylistDto) {
    this.store.dispatch(
      removeTracksFromPlaylist({
        id: playlist.id,
        removeTrackDto: { number: trackNumber },
      })
    );
  }

  onToggleLike(trackId: number) {
    this.store.dispatch(toggleTrackLike({ id: trackId }));
  }

  onAddTrackToPlaylist(track: TrackDto) {
    const dialogRef = this.dialog.open(AddToPlaylistFormDialogComponent, {
      data: 'Playlist',
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
          this.router.navigate(['/playlist/' + playlist.id]);
        }
      });
  }

  onAddCollaboratorToPlaylist(playlist: PlaylistDto) {
    const dialogRef = this.dialog.open(AddCollaboratorFormDialogComponent, {
      data: playlist,
    });

    dialogRef.afterClosed().subscribe((user: User | undefined) => {
      if (user) {
        this.store.dispatch(
          addCollaboratorToPlaylist({
            playlistId: playlist.id,
            userId: user.id,
          })
        );
      }
    });
  }

  onRemoveCollaborator(
    playlist: PlaylistDto,
    collaborator: Pick<User, 'id' | 'name' | 'imageUrl'>
  ) {
    this.store.dispatch(
      removeCollaboratorFromPlaylist({
        playlistId: playlist.id,
        userId: collaborator.id,
      })
    );
  }

  onTrackPositionChange(
    fromAndTo: ChangeTrackPositionDto,
    playlist: PlaylistDto
  ) {
    const { fromIndex, toIndex } = fromAndTo;
    this.store.dispatch(
      changeTrackPosition({
        playlistId: playlist.id,
        fromIndex,
        toIndex,
      })
    );
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

  deletePlaylist(playlist: PlaylistDto) {
    this.store.dispatch(deletePlaylist({ id: playlist.id }));

    this.router.navigate(['/home']);
  }

  toggleLike() {}
}
