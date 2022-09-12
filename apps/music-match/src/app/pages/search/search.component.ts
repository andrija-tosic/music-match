import { PlaylistEntity, ReleaseEntity } from '@music-match/state-entities';
import { Artist, TrackDto, User } from '@music-match/entities';
import {
  selectPlaylistsFromSearchResults,
  selectArtistsFromSearchResults,
  selectReleasesFromSearchResults,
  selectTracksFromSearchResults,
  selectUsersFromSearchResults,
} from './../../state/search/search.selector';
import { Store } from '@ngrx/store';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { debounceTime, filter, map, Subject, Observable } from 'rxjs';
import { AppState } from '../../app.state';
import { querySearch } from '../../state/search/search.action';
import { isNotUndefined } from '../../type-guards';

@Component({
  selector: 'music-match-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  artistResult$ = new Observable<Artist[]>();
  releaseResult$ = new Observable<ReleaseEntity[]>();
  trackResult$ = new Observable<TrackDto[]>();
  userResult$ = new Observable<User[]>();
  playlistResult$ = new Observable<PlaylistEntity[]>();

  constructor(private store: Store<AppState>) {}

  @ViewChild('searchInput') input: ElementRef;
  public subject: Subject<string> = new Subject();

  ngOnInit(): void {
    this.subject
      .pipe(
        debounceTime(300),
        map((text) => text.trim()),
        filter((text) => !!text)
      )
      .subscribe((query) => {
        console.log(query);

        this.store.dispatch(querySearch({ query }));

        this.artistResult$ = this.store
          .select(selectArtistsFromSearchResults(query))
          .pipe(filter(isNotUndefined));

        this.releaseResult$ = this.store
          .select(selectReleasesFromSearchResults(query))
          .pipe(filter(isNotUndefined));

        this.trackResult$ = this.store
          .select(selectTracksFromSearchResults(query))
          .pipe(filter(isNotUndefined));

        this.userResult$ = this.store
          .select(selectUsersFromSearchResults(query))
          .pipe(filter(isNotUndefined));

        this.playlistResult$ = this.store
          .select(selectPlaylistsFromSearchResults(query))
          .pipe(filter(isNotUndefined));
      });
  }
}
