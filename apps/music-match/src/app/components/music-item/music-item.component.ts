import { PlaylistDto } from '@music-match/entities';
import { map, Observable } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'music-match-music-item',
  templateUrl: './music-item.component.html',
  styleUrls: ['./music-item.component.css'],
})
export class MusicItemComponent implements OnInit {
  // @Input() type: string;
  // @Input() name: string;
  // @Input() description: string;
  // @Input() imageUrl: string;

  @Input() playlist$: Observable<PlaylistDto>;

  constructor() {}

  ngOnInit(): void {}

  playlistOwners() {
    return this.playlist$.pipe(
      map((p) => {
        return p.owners.map((owner) => owner.name);
      })
    );
  }
}
