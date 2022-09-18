import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserEntity } from '@music-match/state-entities';
import { Store } from '@ngrx/store';
import { filter, first, Observable } from 'rxjs';
import { AppState } from '../../app.state';
import { UserViewModel } from '../../models/user.view.model';
import {
  selectedUser,
  selectUserCompatibilityReport,
  UserCompatibilityReport,
} from '../../state/selectors';
import { loadUserCompatibility } from '../../state/user-compatibility/user-compatibility.actions';
import { loadUser, toggleUserFollowing } from '../../state/users/user.actions';
import { selectCurrentUser } from '../../state/users/user.selectors';
import { isNotUndefined } from '../../type-guards';

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

  isCurrentUsersFriend(user: UserEntity, currentUser: UserEntity): boolean {
    return currentUser.friendsIds.includes(user.id);
  }

  toggleUserFollowing(user: UserEntity) {
    this.store.dispatch(toggleUserFollowing({ id: user.id }));
  }
}
