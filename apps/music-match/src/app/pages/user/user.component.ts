import { UsersCompatibilityEntity } from '@music-match/state-entities';
import { selectUserById } from './../../state/users/user.selector';
import { loadUser } from './../../state/users/user.action';
import { filter, Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '@music-match/entities';
import { AppState } from '../../app.state';
import { Store } from '@ngrx/store';
import { isNotUndefined } from '../../type-guards';
import { selectUserCompatibilityById } from '../../state/user-compatibility/user-compatibility.selector';
import {
  selectUserCompatibilityReport,
  UserCompatibilityReport,
} from '../../state/selectors';

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

      this.user$ = this.store
        .select(selectUserById(id))
        .pipe(filter(isNotUndefined));

      this.userCompatibility$ = this.store
        .select(selectUserCompatibilityReport(id))
        .pipe(filter(isNotUndefined));
    });
  }
}