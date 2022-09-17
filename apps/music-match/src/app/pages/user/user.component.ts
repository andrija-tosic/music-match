import {
  UserEntity,
  UsersCompatibilityEntity,
} from '@music-match/state-entities';
import {
  selectCurrentUser,
  selectUserById,
} from '../../state/users/user.selectors';
import { loadUser, toggleUserFollowing } from '../../state/users/user.actions';
import { combineLatest, filter, first, map, Observable, take, tap } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '@music-match/entities';
import { AppState } from '../../app.state';
import { Store } from '@ngrx/store';
import { isNotUndefined } from '../../type-guards';
import {
  selectedUser,
  selectUserCompatibilityReport,
  UserCompatibilityReport,
} from '../../state/selectors';
import { loadUserCompatibility } from '../../state/user-compatibility/user-compatibility.actions';
import { UserViewModel } from '../../models/user.view.model';

@Component({
  selector: 'user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent {
  user$: Observable<UserViewModel>;
  userCompatibility$: Observable<UserCompatibilityReport>;
  currentUser$: Observable<UserEntity>;

  constructor(private route: ActivatedRoute, private store: Store<AppState>) {
    this.route.params.subscribe((params) => {
      const id = Number(params['id']);
      this.store.dispatch(loadUser({ id }));

      this.store
        .select(selectCurrentUser)
        .pipe(filter(isNotUndefined), first())
        .subscribe((user) => {
          if (user.id !== id) {
            this.store.dispatch(loadUserCompatibility({ id }));
          }
        });

      this.user$ = this.store.select(selectedUser).pipe(filter(isNotUndefined));

      this.userCompatibility$ = this.store
        .select(selectUserCompatibilityReport(id))
        .pipe(filter(isNotUndefined));

      this.currentUser$ = this.store
        .select(selectCurrentUser)
        .pipe(filter(isNotUndefined));
    });
  }

  isCurrentUsersFriend(): Observable<boolean> {
    return combineLatest([this.user$, this.currentUser$]).pipe(
      take(1),
      map(([user, currentUser]) => currentUser.friendsIds.includes(user.id))
    );
  }

  addFriend(user: UserEntity) {
    this.store.dispatch(toggleUserFollowing({ id: user.id }));
  }

  removeFriend(user: UserEntity) {
    this.store.dispatch(toggleUserFollowing({ id: user.id }));
  }
}
