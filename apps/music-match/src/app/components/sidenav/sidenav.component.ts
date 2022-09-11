import { AppState } from './../../app.state';
import { selectUserPlaylists } from './../../state/playlists/playlist.selector';
import { loadUserPlaylists } from './../../state/playlists/playlist.action';
import { Component, OnInit } from '@angular/core';
import { PlaylistBaseDto } from '@music-match/entities';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'music-match-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
})
export class SidenavComponent implements OnInit {
  usersPlaylist$ = new BehaviorSubject<PlaylistBaseDto[]>([]);
  likedPlaylist$ = new BehaviorSubject<PlaylistBaseDto[]>([]);

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.dispatch(loadUserPlaylists());

    this.store.select(selectUserPlaylists).subscribe(({ usersPlaylists, usersLikedPlaylists }) => {
      this.usersPlaylist$.next(usersPlaylists);
      this.likedPlaylist$.next(usersLikedPlaylists);
    });
  }
}
