import {
  ArtistEntity,
  PlaylistEntity,
  ReleaseEntity,
  UserEntity,
} from '@music-match/state-entities';
import { Artist, Release, User, TrackDto } from '@music-match/entities';
import { Observable } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'search-result-card',
  templateUrl: './search-result-card.component.html',
  styleUrls: ['./search-result-card.component.css'],
})
export class SearchResultCardComponent implements OnInit {
  @Input() item:
    | ArtistEntity
    | ReleaseEntity
    | UserEntity
    | PlaylistEntity
    | undefined;
  @Input() type: 'artist' | 'release' | 'user' | 'playlist';

  constructor() {}

  ngOnInit(): void {}

  getRouterLinkBasedOnType(type: 'artist' | 'release' | 'user' | 'playlist') {
    return `/${type}/${this.item?.id}`;
  }
}
