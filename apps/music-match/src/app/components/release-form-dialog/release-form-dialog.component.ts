import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  CreateReleaseDto,
  ReleaseDto,
  ReleaseType,
  UpdateReleaseDto,
} from '@music-match/entities';
import { ArtistEntity } from '@music-match/state-entities';
import { ActionsSubject, Store } from '@ngrx/store';
import { GenreType } from 'libs/entities/src/lib/genre/genre-type';
import {
  BehaviorSubject,
  filter,
  first,
  map,
  Observable,
  startWith,
} from 'rxjs';
import { AppState } from '../../app.state';
import { FileService } from '../../services/file.service';
import * as ReleaseActions from '../../state/releases/release.actions';
import {
  createRelease,
  updateRelease,
} from '../../state/releases/release.actions';
import { selectedRelease } from '../../state/selectors';
import { isNotUndefined } from '../../type-guards';
import { ArtistFormDialogComponent } from '../artist-form-dialog/artist-form-dialog.component';
import { SnackbarService } from '../../services/snackbar.service';
import { ofType } from '@ngrx/effects';
import { Router } from '@angular/router';

@Component({
  selector: 'music-match-release-form-dialog',
  templateUrl: './release-form-dialog.component.html',
  styleUrls: ['./release-form-dialog.component.css'],
})
export class ReleaseFormDialogComponent implements OnInit {
  imageUrl: string = '';
  imageFile: any = undefined;

  public form;

  releaseTypes = Object.keys(ReleaseType);
  allGenreTypes = Object.keys(GenreType);

  genreTypesInMatChips: string[] = [];

  uploading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @ViewChild('genreInput') genreInput: ElementRef<HTMLInputElement>;
  filteredGenres$: Observable<string[]>;

  constructor(
    private fileService: FileService,
    private store: Store<AppState>,
    private dialogRef: MatDialogRef<ArtistFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public releaseDialogData: {
      actionType: 'Update' | 'Create';
      release: ReleaseDto | undefined;
      artist: ArtistEntity;
    },
    private snackbar: SnackbarService,
    private action$: ActionsSubject,
    private router: Router
  ) {
    this.form = new FormGroup({
      name: new FormControl(
        this.releaseDialogData.release
          ? this.releaseDialogData.release.name
          : '',
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      releaseDate: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      releaseType: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      genreTypes: new FormControl('', {
        validators: [Validators.required],
      }),

      tracks: new FormArray([this.createTrackInForm()], {
        validators: [Validators.required],
      }),
    });

    if (this.releaseDialogData.actionType === 'Update') {
      this.store
        .select(selectedRelease)
        .pipe(filter(isNotUndefined), first())
        .subscribe((release) => {
          this.imageUrl = release.imageUrl;
          this.form.get('name')!.patchValue(release.name);
        });
    }
  }

  get tracksInForm() {
    return this.form?.controls['tracks'] as FormArray;
  }

  ngOnInit(): void {
    if (
      this.releaseDialogData.actionType === 'Update' &&
      this.releaseDialogData.release
    ) {
      console.log(this.releaseDialogData.release);

      this.form.controls['releaseDate'].setValue(
        this.releaseDialogData.release.releaseDate.substring(0, 10)
      );

      this.form.controls['releaseType'].setValue(
        Object.keys(ReleaseType)[
          Object.values(ReleaseType).indexOf(
            this.releaseDialogData.release.type
          )
        ]
      );

      this.imageUrl = this.releaseDialogData.release.imageUrl;

      this.genreTypesInMatChips = this.releaseDialogData.release.genres.map(
        ({ type }) =>
          Object.keys(GenreType)[Object.values(GenreType).indexOf(type)]
      );

      this.tracksInForm.clear();

      this.releaseDialogData.release.tracks.forEach((track, index) => {
        this.tracksInForm.push(
          new FormGroup({
            id: new FormControl(track.id, { nonNullable: true }),
            number: new FormControl(index + 1, { nonNullable: true }),
            name: new FormControl(track.name, {
              nonNullable: true,
              validators: [Validators.required],
            }),
            duration: new FormControl(track.duration, {
              nonNullable: true,
              validators: [Validators.required],
            }),
          })
        );
      });
    } else {
      this.form.controls['releaseDate'].setValue(
        new Date().toISOString().substring(0, 10)
      );
      this.form.controls['releaseType'].setValue(
        this.releaseTypes[0].toString()
      );
    }

    this.filteredGenres$ = this.form.controls['genreTypes'].valueChanges.pipe(
      startWith(null),
      map((typedInGenre: string | null) =>
        typedInGenre
          ? this._filter(typedInGenre)
          : this.allGenreTypes.filter(
              (genre) =>
                !this.genreTypesInMatChips
                  .map((genreInMatChips) => genreInMatChips.toLowerCase())
                  .includes(genre.toLowerCase())
            )
      )
    );
  }

  addGenreChip(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.genreTypesInMatChips.push(value);
    }

    event.chipInput!.clear();

    this.form.controls['genreTypes'].setValue(null);
  }

  removeGenreChip(genre: string): void {
    const index = this.genreTypesInMatChips.indexOf(genre);

    if (index >= 0) {
      this.genreTypesInMatChips.splice(index, 1);
    }
  }

  genreChipSelected(event: MatAutocompleteSelectedEvent): void {
    this.genreTypesInMatChips.push(event.option.viewValue);
    this.genreInput.nativeElement.value = '';
    this.form.controls['genreTypes'].setValue(null);
  }

  onAddTrack() {
    this.tracksInForm.push(this.createTrackInForm());
  }

  onRemoveTrack(i: number) {
    this.tracksInForm.removeAt(i);
  }

  createTrackInForm() {
    const number: number = this.tracksInForm ? this.tracksInForm.length + 1 : 1;

    return new FormGroup({
      id: new FormControl(-1, { nonNullable: true }),
      number: new FormControl(number, { nonNullable: true }),
      name: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      duration: new FormControl(30, {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });
  }

  removeImage() {
    this.imageUrl = '';
  }

  onFileChanged(event: any) {
    this.imageFile = event.target.files[0];

    this.fileService.readFile(this.imageFile).subscribe({
      next: (url) => {
        this.imageUrl = url;
      },
      error: (msg) => {
        this.snackbar.showError(msg);
      },
    });
  }

  onConfirm(): void {
    this.form.markAsTouched();

    this.uploading$.next(true);
    this.dialogRef.disableClose = true;

    const { name, releaseDate, releaseType, tracks } = this.form.getRawValue();

    let releaseToDispatch: CreateReleaseDto | UpdateReleaseDto = {};

    if (this.releaseDialogData.actionType === 'Create') {
      releaseToDispatch = {
        name,
        imageUrl: '',
        releaseDate,
        type: ReleaseType[releaseType as keyof typeof ReleaseType],
        tracks,
        artistIds: [this.releaseDialogData.artist.id],
        genres: this.genreTypesInMatChips.map((genre) => {
          return {
            type: GenreType[genre as keyof typeof GenreType],
          };
        }),
      };
    } else if (this.releaseDialogData.actionType === 'Update') {
      releaseToDispatch = {
        name,
        imageUrl: this.releaseDialogData.release!.imageUrl,
        releaseDate,
        type: ReleaseType[releaseType as keyof typeof ReleaseType],
        tracks,
        artistIds: this.releaseDialogData.release!.artists.map(({ id }) => id),
        genres: this.genreTypesInMatChips.map((genre) => {
          return {
            type: GenreType[genre as keyof typeof GenreType],
          };
        }),
      };
    }
    console.log(this.genreTypesInMatChips);

    console.log('payload:', releaseToDispatch, releaseType);

    if (this.imageFile && this.imageUrl !== '') {
      this.fileService.uploadImage(this.imageFile).subscribe((newImageUrl) => {
        this.uploading$.next(false);

        releaseToDispatch.imageUrl = newImageUrl;

        this.dispatchCreateOrUpdateRelease(
          releaseToDispatch,
          this.releaseDialogData.actionType
        );
      });
    } else {
      this.dispatchCreateOrUpdateRelease(
        releaseToDispatch,
        this.releaseDialogData.actionType
      );
    }

    this.uploading$.next(false);
    this.dialogRef.disableClose = false;

    if (this.releaseDialogData.actionType === 'Create') {
      this.action$
        .pipe(ofType(ReleaseActions.createdRelease), first())
        .subscribe(({ release }) => {
          this.router.navigate(['release/' + release.id]);
          this.dialogRef.close();
        });
    } else {
      this.dialogRef.close();
    }
  }

  dispatchCreateOrUpdateRelease(
    releaseDto: CreateReleaseDto | UpdateReleaseDto,
    actionType: 'Create' | 'Update'
  ) {
    if (actionType === 'Create') {
      const release = releaseDto as CreateReleaseDto;
      this.store.dispatch(createRelease({ release }));
    } else if (actionType === 'Update') {
      const release = releaseDto as UpdateReleaseDto;
      this.store.dispatch(
        updateRelease({ id: this.releaseDialogData.release!.id, release })
      );
    }
  }

  onDismiss(): void {
    this.dialogRef.close();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allGenreTypes.filter((genre) =>
      genre.toLowerCase().includes(filterValue)
    );
  }
}
