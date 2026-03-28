import { Component, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Header } from '../../../layout/header/header';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { ApiService } from '../../../shared/service/api/api-service';
import { PasswordResetRequest } from '../../../shared/models/password-reset';
import { LoaderService } from '../../../shared/service/loader-service/loader-service';
import { NotificationService } from '../../../shared/service/notification-service/notification-service';
import { Router } from '@angular/router';
import { ApiResponse } from '../../../shared/models/api-response';
import { HttpErrorResponse } from '@angular/common/http';

// Forgot password component - handles password reset process with OTP verification
@Component({
  selector: 'app-forgot-password',
  imports: [
    FormsModule,
    Header,
    MatButton,
    MatCard,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatError,
  ],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPassword {
  otpRequestForm: FormGroup;
  passwordResetForm: FormGroup;
  email = signal<string>('');
  otp = signal<string>('');
  newPassword = signal<string>('');

  step = signal<number>(1); // 1 = Request, 2 = Confirm
  isLoading = signal<boolean>(false);

  constructor(
    private readonly api: ApiService,
    private readonly loaderService: LoaderService,
    private readonly notification: NotificationService,
    private readonly router: Router,
    private readonly fb: FormBuilder,
  ) {
    // Create form for OTP request with email validation
    this.otpRequestForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
    // Create form for password reset with OTP and new password validation
    this.passwordResetForm = this.fb.group({
      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/),
        ],
      ],
      otp: ['', [Validators.required, Validators.maxLength(6), Validators.minLength(6)]],
    });
  }

  // Request OTP for password reset - send email to API
  onRequestOtp() {
    // Validate email form
    if (this.otpRequestForm.invalid) {
      this.notification.show('error', 'Please fix the errors in the form.');
      return;
    }
    this.email.set(this.otpRequestForm.value.email);
    const data = { email: this.otpRequestForm.value.email };

    this.isLoading.set(true);
    this.loaderService.show();
    this.api.requestPasswordReset(data).subscribe({
      next: (res: ApiResponse) => {
        this.step.set(2); // Move to OTP verification step
        this.isLoading.set(false);
        this.loaderService.hide();
        this.notification.show('success', res.message || 'OTP Sent Successfully');
      },
      error: (err: HttpErrorResponse) => {
        this.loaderService.hide();
        this.isLoading.set(false);
        const errorMessage = err.error?.error || 'An unexpected error occurred';
        this.notification.show('error', errorMessage);
      },
    });
  }

  // Reset password - verify OTP and set new password
  onResetPassword() {
    // Validate password reset form
    if (this.passwordResetForm.invalid) {
      this.notification.show('error', 'Please fix the errors in the form.');
      return;
    }

    this.isLoading.set(true);
    this.loaderService.show();
    const payload: PasswordResetRequest = {
      email: this.email(),
      otp: this.passwordResetForm.value.otp,
      new_password: this.passwordResetForm.value.newPassword,
    };

    this.api.confirmPasswordReset(payload).subscribe({
      next: (res: ApiResponse) => {
        this.loaderService.hide();
        this.isLoading.set(false);
        this.notification.show('success', res.message || 'Password reset successfully');
        this.router.navigate(['/login']); // Redirect to login after successful reset
      },
      error: (err: HttpErrorResponse) => {
        this.loaderService.hide();
        const errorMessage = err.error?.error || 'An unexpected error occurred';
        this.notification.show('error', errorMessage);
        this.isLoading.set(false);
      },
    });
  }
}
