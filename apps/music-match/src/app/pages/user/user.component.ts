import { UsersCompatibilityEntity } from '@music-match/state-entities';
import {
  selectCurrentUser,
  selectUserById,
} from '../../state/users/user.selectors';
import { loadUser } from '../../state/users/user.actions';
import { filter, Observable, tap } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '@music-match/entities';
import { AppState } from '../../app.state';
import { Store } from '@ngrx/store';
import { isNotUndefined } from '../../type-guards';
import {
  selectUserCompatibilityReport,
  UserCompatibilityReport,
} from '../../state/selectors';
import { loadUserCompatibility } from '../../state/user-compatibility/user-compatibility.actions';

@Component({
  selector: 'user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  constructor(private route: ActivatedRoute, private store: Store<AppState>) {}

  user$: Observable<User>;
  userCompatibility$: Observable<UserCompatibilityReport>;

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      this.store.dispatch(loadUser({ id }));

      this.store.select(selectCurrentUser).pipe(
        tap((user) => {
          if (user?.id !== id) {
            this.store.dispatch(loadUserCompatibility({ id }));
          }
        })
      );

      this.user$ = this.store
        .select(selectUserById(id))
        .pipe(filter(isNotUndefined));

      this.userCompatibility$ = this.store
        .select(selectUserCompatibilityReport(id))
        .pipe(filter(isNotUndefined));
    });
  }
}
