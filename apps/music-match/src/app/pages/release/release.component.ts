import { selectedRelease } from './../../state/selectors';
import { loadRelease } from './../../state/releases/release.action';
import { filter, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AppState } from '../../app.state';
import { ReleaseDto } from '@music-match/entities';
import { isNotUndefined } from '../../type-guards';

@Component({
  selector: 'music-match-release',
  templateUrl: './release.component.html',
  styleUrls: ['./release.component.css'],
})
export class ReleaseComponent implements OnInit {
  constructor(private route: ActivatedRoute, private store: Store<AppState>) {}

  release$: Observable<ReleaseDto>;

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      this.store.dispatch(loadRelease({ id }));

      this.release$ = this.store
        .select(selectedRelease)
        .pipe(filter(isNotUndefined));
    });
  }
}
