import { Artist } from '@music-match/entities';
import { Component, Input, OnInit } from '@angular/core';
import { filter, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.state';
import { isNotUndefined } from '../../type-guards';
import { ActivatedRoute, Router } from '@angular/router';
import {
  deleteArtist,
  loadArtistWithReleases,
} from '../../state/artists/artist.actions';
import { selectedArtist } from '../../state/selectors';
import { ArtistEntity, ReleaseEntity } from '@music-match/state-entities';
import { MatDialog } from '@angular/material/dialog';
import { ArtistFormDialogComponent } from '../../components/artist-form-dialog/artist-form-dialog.component';
import { ReleaseFormDialogComponent } from '../../components/release-form-dialog/release-form-dialog.component';
import { ArtistViewModel } from '../../models/artist.view.model';

@Component({
  selector: 'artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.css'],
})
export class ArtistComponent {
  artist$: Observable<ArtistViewModel>;

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.route.params.subscribe((params) => {
      this.store.dispatch(loadArtistWithReleases({ id: params['id'] }));
    });

    this.artist$ = this.store
      .select(selectedArtist)
      .pipe(filter(isNotUndefined));
  }

  openReleaseFormDialog(actionType: string, artist: ArtistViewModel) {
    this.dialog.open(ReleaseFormDialogComponent, {
      data: { actionType, artist },
    });
  }

  openArtistFormDialog(actionType: string) {
    this.dialog.open(ArtistFormDialogComponent, {
      data: actionType,
      maxHeight: '90vh',
      maxWidth: '90vh',
    });
  }

  deleteArtist(artist: ArtistViewModel) {
    this.store.dispatch(deleteArtist(artist));
    this.router.navigate(['/home']);
  }
}
