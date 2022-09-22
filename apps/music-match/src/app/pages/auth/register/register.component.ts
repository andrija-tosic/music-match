import { ApiError } from '../../../types';
import { Roles } from '@music-match/entities';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['../auth.scss'],
})
export class RegisterComponent {
  form;
  constructor(
    private authService: AuthService,
    private router: Router,
    private _snackBar: SnackbarService
  ) {
    this.form = new FormGroup({
      name: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(3)],
      }),
      username: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(8)],
      }),
    });
  }

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
        this._snackBar.showApiError(res);
      },
    });
  }
}
