import { ApiError } from './../../types';
import { Roles } from '@music-match/entities';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { constants, snackbarError } from '../../constants';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'music-match-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  form;
  constructor(private authService: AuthService, private router: Router, private _snackBar: MatSnackBar) {
    this.form = new FormGroup({
      name: new FormControl('', { nonNullable: true, validators: [Validators.minLength(3)] }),
      username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      password: new FormControl('', { nonNullable: true, validators: [Validators.minLength(8)] }),
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dto = { ...this.form.getRawValue(), role: Roles.User };

    this.authService.register(dto).subscribe({
      next: () => {
        console.log('registered');
        this.router.navigate(['/login']);
      },
      error: (res: ApiError) => {
        console.log(res.error);
        snackbarError(this._snackBar, res);
      },
    });
  }
}
