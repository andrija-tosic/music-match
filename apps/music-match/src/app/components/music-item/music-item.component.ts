import { MatDialog } from '@angular/material/dialog';
import { PlaylistDto } from '@music-match/entities';
import { map, Observable } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { PlaylistFormDialogComponent } from '../playlist-form-dialog/playlist-form-dialog.component';

@Component({
  selector: 'music-item',
  templateUrl: './music-item.component.html',
  styleUrls: ['./music-item.component.css'],
})
export class MusicItemComponent implements OnInit {
  @Input() playlist: PlaylistDto | null;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  playlistOwnersNames() {
    return this.playlist?.owners.map((owner) => owner.name);
  }

  openPlaylistFormDialog(actionType: string) {
    const dialogRef = this.dialog.open(PlaylistFormDialogComponent, {
      data: actionType,
    });
  }

  toggleLike() {}
}
