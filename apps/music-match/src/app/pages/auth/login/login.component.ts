import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['../auth.scss'],
})
export class LoginComponent {
  form;
  constructor(
    private authService: AuthService,
    private router: Router,
    private _snackBar: SnackbarService
  ) {
    this.form = new FormGroup({
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

    this.authService.login(this.form.getRawValue()).subscribe({
      next: () => {
        console.log('logged in');
        this.router.navigate(['/']);
      },
      error: (res: { error: { message: string } }) => {
        console.log(res);
        this._snackBar.showApiError(res);
      },
    });
  }
}
