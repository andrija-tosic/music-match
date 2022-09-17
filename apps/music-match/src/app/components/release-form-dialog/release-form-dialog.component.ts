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
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CreateReleaseDto, ReleaseType } from '@music-match/entities';
import { ArtistEntity } from '@music-match/state-entities';
import { Store } from '@ngrx/store';
import { GenreType } from 'libs/entities/src/lib/genre/genre-type';
import {
  BehaviorSubject,
  filter,
  map,
  Observable,
  startWith,
  take,
} from 'rxjs';
import { AppState } from '../../app.state';
import { FileService } from '../../services/file.service';
import {
  createRelease,
  updateRelease,
} from '../../state/releases/release.actions';
import { selectedRelease } from '../../state/selectors';
import { isNotUndefined } from '../../type-guards';
import { ArtistFormDialogComponent } from '../artist-form-dialog/artist-form-dialog.component';

@Component({
  selector: 'music-match-release-form-dialog',
  templateUrl: './release-form-dialog.component.html',
  styleUrls: ['./release-form-dialog.component.css'],
})
export class ReleaseFormDialogComponent implements OnInit {
  imageUrl: string = '';
  imageFile: any = undefined;

  public form;

  releaseTypes = Object.keys(ReleaseType).filter((key) => isNaN(Number(key)));

  allGenreTypes = Object.keys(GenreType).filter((key) => isNaN(Number(key)));

  genreTypesInMatChips: string[] = [];

  uploading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @ViewChild('genreInput') genreInput: ElementRef<HTMLInputElement>;
  filteredGenres: Observable<string[]>;

  constructor(
    private fileService: FileService,
    private store: Store<AppState>,
    private dialogRef: MatDialogRef<ArtistFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public artistAndActionType: {
      actionType: 'Update' | 'Create';
      artist: ArtistEntity;
    }
  ) {
    this.form = new FormGroup({
      name: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
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

    if (this.artistAndActionType.actionType === 'Update') {
      this.store
        .select(selectedRelease)
        .pipe(take(1), filter(isNotUndefined))
        .subscribe((release) => {
          this.imageUrl = release.imageUrl;
          this.form.get('name')!.patchValue(release.name);
        });
    }
  }

  ngOnInit(): void {
    this.form.controls['releaseDate'].setValue(
      new Date().toISOString().substring(0, 10)
    );

    this.form.controls['releaseType'].setValue(this.releaseTypes[0].toString());

    this.filteredGenres = this.form.controls['genreTypes'].valueChanges.pipe(
      startWith(null),
      map((genre: string | null) =>
        genre ? this._filter(genre) : this.allGenreTypes.slice()
      )
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    console.log(
      this.allGenreTypes.filter((genre) =>
        genre.toLowerCase().includes(filterValue)
      )
    );

    return this.allGenreTypes.filter((genre) =>
      genre.toLowerCase().includes(filterValue)
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

  get tracks() {
    return this.form?.controls['tracks'] as FormArray;
  }

  onAddTrack() {
    this.tracks.push(this.createTrackInForm());
  }

  onRemoveTrack(i: number) {
    this.tracks.removeAt(i);
  }

  createTrackInForm() {
    const number: number = this.tracks ? this.tracks.length + 1 : 1;

    return new FormGroup({
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

    const reader = new FileReader();
    reader.readAsDataURL(this.imageFile);
    reader.onload = (e: any) => {
      this.imageUrl = e.target.result;
    };
  }

  onConfirm(): void {
    this.uploading$.next(true);
    this.dialogRef.disableClose = true;

    const { name, releaseDate, releaseType, tracks } = this.form.getRawValue();

    const releaseToDispatch: CreateReleaseDto = {
      name,
      imageUrl: '',
      releaseDate,
      type: ReleaseType[releaseType as keyof typeof ReleaseType],
      tracks,
      artistIds: [this.artistAndActionType.artist.id],
      genres: this.genreTypesInMatChips.map((genre) => {
        return {
          type: GenreType[genre as keyof typeof GenreType],
        };
      }),
    };

    console.log('payload:', releaseToDispatch);

    if (this.imageFile && this.imageUrl !== '') {
      this.fileService.uploadImage(this.imageFile).subscribe((newImageUrl) => {
        this.uploading$.next(false);

        releaseToDispatch.imageUrl = newImageUrl;

        this.dispatchCreateOrUpdateRelease(
          releaseToDispatch,
          this.artistAndActionType.actionType
        );
      });
    } else {
      this.dispatchCreateOrUpdateRelease(
        releaseToDispatch,
        this.artistAndActionType.actionType
      );
    }

    this.uploading$.next(false);
    this.dialogRef.disableClose = false;
    this.dialogRef.close();
  }

  dispatchCreateOrUpdateRelease(
    release: CreateReleaseDto,
    actionType: 'Create' | 'Update'
  ) {
    if (actionType === 'Create') {
      this.store.dispatch(createRelease({ release }));
    } else if (actionType === 'Update') {
      this.store.dispatch(updateRelease({ release }));
    }
  }

  onDismiss(): void {
    this.dialogRef.close();
  }
}
