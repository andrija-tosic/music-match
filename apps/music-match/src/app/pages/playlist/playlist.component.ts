import { PlaylistDto } from '@music-match/entities';
import { ActivatedRoute } from '@angular/router';
import { selectedPlaylist } from '../../state/selectors';
import { filter, Observable } from 'rxjs';
import { AppState } from './../../app.state';
import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { loadPlaylistWithTracks } from '../../state/playlists/playlist.action';
import { isNotUndefined } from '../../type-guards';

@Component({
  selector: 'music-match-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css'],
})
export class PlaylistComponent implements OnInit {
  playlist$ = new Observable<PlaylistDto>();

  constructor(private store: Store<AppState>, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.store.dispatch(loadPlaylistWithTracks({ id: params['id'] }));
    });

    this.playlist$ = this.store
      .select(selectedPlaylist)
      .pipe(filter(isNotUndefined));
  }
}
