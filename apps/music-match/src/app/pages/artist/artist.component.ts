import { Artist } from '@music-match/entities';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.css'],
})
export class ArtistComponent implements OnInit {
  @Input() artist: Artist | null;

  constructor() {}

  ngOnInit(): void {}

  openArtistFormDialog(type: 'Create' | 'Update') {}

  deleteArtist() {}
}
