import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PlaylistDto } from '@music-match/entities';
import { PlaylistEntity, UserEntity } from '@music-match/state-entities';
import { Store } from '@ngrx/store';
import { Observable, filter, map } from 'rxjs';
import { AppState } from '../../app.state';
import { selectCurrentUsersFriends } from '../../state/users/user.selectors';
import { isNotUndefined } from '../../type-guards';
import { PlaylistFormDialogComponent } from '../playlist-form-dialog/playlist-form-dialog.component';

@Component({
  selector: 'music-match-add-collaborator-form-dialog',
  templateUrl: './add-collaborator-form-dialog.component.html',
  styleUrls: ['./add-collaborator-form-dialog.component.css'],
})
export class AddCollaboratorFormDialogComponent {
  friend$: Observable<UserEntity[]>;

  constructor(
    public dialogRef: MatDialogRef<PlaylistFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public playlist: PlaylistDto,
    private store: Store<AppState>
  ) {
    this.friend$ = this.store.select(selectCurrentUsersFriends).pipe(
      filter(isNotUndefined),
      map((users) =>
        users.filter(
          (user) => !this.playlist.owners.map(({ id }) => id).includes(user.id)
        )
      )
    );
  }

  addCollaboratorToPlaylist(friend: UserEntity) {
    this.dialogRef.close(friend);
  }
}
