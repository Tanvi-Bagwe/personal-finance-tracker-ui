import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatError, MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { ApiService } from '../../shared/service/api/api-service';
import { NotificationService } from '../../shared/service/notification-service/notification-service';
import { ChangePasswordRequest } from '../../shared/models/auth-models';
import { ApiResponse } from '../../shared/models/api-response';
import { HttpErrorResponse } from '@angular/common/http';

// Change password component - allows user to change their password
@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButton,
    MatCard,
    MatCardContent,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    MatError,
    MatHint,
    // ...
  ],
  templateUrl: './change-password.html',
  styleUrl: './change-password.scss',
})
export class ChangePassword {
  passwordForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly api: ApiService,
    private readonly notification: NotificationService,
  ) {
    // Create form with validators for password fields
    this.passwordForm = this.fb.group(
      {
        oldPassword: ['', [Validators.required]],
        newPassword: [
          '',
          [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }, // Check if new passwords match
    );
  }

  // Validate that new password and confirm password match
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPass = control.get('newPassword')?.value;
    const confirm = control.get('confirmPassword')?.value;
    return newPass === confirm ? null : { mismatch: true };
  }

  // Change user password - validate form and send to API
  onChangePassword() {
    if (this.passwordForm.valid) {
      const payload: ChangePasswordRequest = {
        old_password: this.passwordForm.value.oldPassword,
        new_password: this.passwordForm.value.newPassword,
      };

      this.api.changePassword(payload).subscribe({
        next: (res: ApiResponse) => {
          this.notification.show('success', res.message || 'Password updated successfully!');
          this.passwordForm.reset();
        },
        error: (err: HttpErrorResponse) =>
          this.notification.show('error', err.error?.message || 'Update failed'),
      });
    } else {
      this.notification.show('error', 'Please fix the errors in the form.');
    }
  }
}
