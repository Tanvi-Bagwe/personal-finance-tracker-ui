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
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { ApiService } from '../../shared/service/api/api-service';
import { NotificationService } from '../../shared/service/notification-service/notification-service';
import { ChangePasswordRequest } from '../../shared/models/auth-models';

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
    this.passwordForm = this.fb.group(
      {
        oldPassword: ['', [Validators.required]],
        // Regex: 8+ chars, 1 Upper, 1 Lower, 1 Digit
        newPassword: [
          '',
          [
            Validators.required,
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            ),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator },
    );
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPass = control.get('newPassword')?.value;
    const confirm = control.get('confirmPassword')?.value;
    return newPass === confirm ? null : { mismatch: true };
  }

  onChangePassword() {
    if (this.passwordForm.valid) {
      const payload: ChangePasswordRequest = {
        old_password: this.passwordForm.value.oldPassword,
        new_password: this.passwordForm.value.newPassword,
      };

      this.api.changePassword(payload).subscribe({
        next: () => {
          this.notification.show('success', 'Password updated successfully!');
          this.passwordForm.reset();
        },
        error: (err: { error: { message: any } }) =>
          this.notification.show('error', err.error?.message || 'Update failed'),
      });
    }
  }
}
