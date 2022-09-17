import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { TrackDto } from '@music-match/entities';

@Component({
  selector: 'tracks',
  templateUrl: './tracks.component.html',
  styleUrls: ['./tracks.component.css'],
})
export class TracksComponent implements OnInit {
  constructor() {}

  @Input() tracks: TrackDto[];
  @Input() editable: boolean = false;

  @Output() trackRemove = new EventEmitter<number>();
  @Output() likeToggle = new EventEmitter<number>();
  @Output() addToPlaylist = new EventEmitter<TrackDto>();
  @Output() trackPositionChange = new EventEmitter<{
    fromIndex: number;
    toIndex: number;
  }>();

  @Input() type: 'playlist' | 'release' | 'artist';

  ngOnInit() {
    if (this.type === null) {
      throw new Error('type is required.');
    }
  }

  toggleTrackLike(track: TrackDto) {
    this.likeToggle.emit(track.id);
  }

  removeTrackFromPlaylist(track: TrackDto) {
    this.trackRemove.emit(track.number);
  }

  addTrackToPlaylist(track: TrackDto) {
    this.addToPlaylist.emit(track);
  }

  drop(event: CdkDragDrop<TrackDto[]>) {
    moveItemInArray(this.tracks, event.previousIndex, event.currentIndex);
    this.trackPositionChange.emit({
      fromIndex: event.previousIndex,
      toIndex: event.currentIndex,
    });
  }
}
