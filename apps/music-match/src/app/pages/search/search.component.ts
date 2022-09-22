import {
  ArtistEntity,
  PlaylistEntity,
  ReleaseEntity,
  UserEntity,
} from '@music-match/state-entities';
import { TrackDto } from '@music-match/entities';
import {
  selectArtistsFromSearchResults,
  selectPlaylistsFromSearchResults,
  selectReleasesFromSearchResults,
  selectTracksFromSearchResults,
  selectUsersFromSearchResults,
} from '../../state/search/search.selectors';
import { Store } from '@ngrx/store';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  Subject,
} from 'rxjs';
import { AppState } from '../../app.state';
import { querySearch } from '../../state/search/search.actions';
import { isNotUndefined } from '../../type-guards';

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit, AfterViewInit {
  artistResult$: Observable<ArtistEntity[]>;
  releaseResult$: Observable<ReleaseEntity[]>;
  trackResult$: Observable<TrackDto[]>;
  userResult$: Observable<UserEntity[]>;
  playlistResult$: Observable<PlaylistEntity[]>;
  @ViewChild('searchInput') input: ElementRef;
  public subject = new Subject<string>();

  constructor(
    private store: Store<AppState>,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.subject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter((text) => !!text),
        map((text) => text.trim())
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

  ngAfterViewInit() {
    this.input.nativeElement.focus();

    this.cdRef.detectChanges();
  }
}
