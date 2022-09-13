import { TrackDto } from '@music-match/entities';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'track-result-card',
  templateUrl: './track-result-card.component.html',
  styleUrls: ['./track-result-card.component.css'],
})
export class TrackResultCardComponent implements OnInit {
  @Input() track: TrackDto | null;

  constructor() {}

  ngOnInit(): void {
    console.log(this.track);
  }

  trackArtistsNames() {
    return this.track?.release?.artists?.map(({ name }) => name);
  }
}
