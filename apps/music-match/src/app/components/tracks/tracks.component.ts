import { Observable, take, tap } from 'rxjs';
import {
  addTracksToPlaylist,
  removeTracksFromPlaylist,
} from './../../state/playlists/playlist.action';
import { Store } from '@ngrx/store';
import { Component, Input, OnInit } from '@angular/core';
import {
  TrackDto,
  PlaylistDto,
  Release,
  ReleaseDto,
} from '@music-match/entities';
import { AppState } from '../../app.state';
import { toggleTrackLike } from '../../state/tracks/track.action';

@Component({
  selector: 'tracks',
  templateUrl: './tracks.component.html',
  styleUrls: ['./tracks.component.css'],
})
export class TracksComponent implements OnInit {
  constructor(private store: Store<AppState>) {}

  @Input() item: PlaylistDto | ReleaseDto | null;

  @Input() type: 'playlist' | 'release';

  ngOnInit(): void {
    console.log(this.item);
  }

  toggleTrackLike(track: TrackDto) {
    this.store.dispatch(toggleTrackLike({ id: track.id }));
  }

  removeTrackFromPlaylist(track: TrackDto) {
    if (this.item) {
      this.store.dispatch(
        removeTracksFromPlaylist({
          id: this.item.id,
          removeTrackDto: { number: track.number },
        })
      );
    }
  }

  drop(event: any) {}
}
