import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { TrackDto } from '@music-match/entities';

@Component({
  selector: 'tracks',
  templateUrl: './tracks.component.html',
  styleUrls: ['./tracks.component.css'],
})
export class TracksComponent implements OnInit {
  constructor() {}

  @Input() tracks: TrackDto[] | undefined;
  @Output() onRemoveTrack = new EventEmitter<number>();
  @Output() onToggleLike = new EventEmitter<number>();
  @Output() onAddToPlaylist = new EventEmitter<TrackDto>();

  @Input() type: 'playlist' | 'release' | 'artist';

  ngOnInit() {
    if (this.type === null) {
      throw new Error('type is required.');
    }
  }

  toggleTrackLike(track: TrackDto) {
    this.onToggleLike.emit(track.id);
  }

  removeTrackFromPlaylist(track: TrackDto) {
    this.onRemoveTrack.emit(track.number);
  }

  addTrackToPlaylist(track: TrackDto) {
    this.onAddToPlaylist.emit(track);
  }

  drop(event: any) {}
}
