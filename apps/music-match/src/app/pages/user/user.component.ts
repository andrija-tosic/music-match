import { selectUserById } from './../../state/users/user.selector';
import { loadUser } from './../../state/users/user.action';
import { filter, Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '@music-match/entities';
import { AppState } from '../../app.state';
import { Store } from '@ngrx/store';
import { isNotUndefined } from '../../type-guards';

@Component({
  selector: 'music-match-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  constructor(private route: ActivatedRoute, private store: Store<AppState>) {}

  user$: Observable<User>;

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      this.store.dispatch(loadUser({ id }));

      this.user$ = this.store
        .select(selectUserById(id))
        .pipe(filter(isNotUndefined));
    });
  }
}
