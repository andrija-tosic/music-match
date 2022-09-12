import { Observable, take } from 'rxjs';
import {
  addTracksToPlaylist,
  removeTracksFromPlaylist,
} from './../../state/playlists/playlist.action';
import { Store } from '@ngrx/store';
import { Component, Input, OnInit } from '@angular/core';
import { TrackDto, PlaylistDto } from '@music-match/entities';
import { AppState } from '../../app.state';

@Component({
  selector: 'music-match-tracks',
  templateUrl: './tracks.component.html',
  styleUrls: ['./tracks.component.css'],
})
export class TracksComponent implements OnInit {
  constructor(private store: Store<AppState>) {}

  @Input() playlist$: Observable<PlaylistDto>;

  ngOnInit(): void {}

  removeTrack(track: TrackDto) {
    this.playlist$.pipe(take(1)).subscribe((playlist) => {
      this.store.dispatch(
        removeTracksFromPlaylist({
          id: playlist.id,
          removeTrackDto: { number: track.number },
        })
      );
    });
  }

  drop(event: any) {}
}
