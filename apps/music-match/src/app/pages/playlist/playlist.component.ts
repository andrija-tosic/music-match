import { ActivatedRoute } from '@angular/router';
import { selectedPlaylist } from './../../state/playlists/playlist.selector';
import { Observable } from 'rxjs';
import { AppState } from './../../app.state';
import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { PlaylistDto } from '@music-match/entities';
import { loadPlaylistWithTracks } from '../../state/playlists/playlist.action';

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

    this.playlist$ = this.store.select(selectedPlaylist);
  }
}
