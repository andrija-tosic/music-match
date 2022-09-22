import {
  ArtistEntity,
  PlaylistEntity,
  ReleaseEntity,
  UserEntity,
} from '@music-match/state-entities';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'search-result-card',
  templateUrl: './search-result-card.component.html',
  styleUrls: ['./search-result-card.component.css'],
})
export class SearchResultCardComponent {
  @Input() item:
    | ArtistEntity
    | ReleaseEntity
    | UserEntity
    | PlaylistEntity
    | undefined;
  @Input() type: 'artist' | 'release' | 'user' | 'playlist';

  constructor() {}

  getRouterLinkBasedOnType(type: 'artist' | 'release' | 'user' | 'playlist') {
    return `/${type}/${this.item?.id}`;
  }
}
