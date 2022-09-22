import { TrackDto } from '@music-match/entities';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'track-result-card',
  templateUrl: './track-result-card.component.html',
  styleUrls: ['./track-result-card.component.css'],
})
export class TrackResultCardComponent {
  @Input() track: TrackDto | null;

  constructor() {}

  trackArtistsNames() {
    return this.track?.release?.artists?.map(({ name }) => name);
  }
}
