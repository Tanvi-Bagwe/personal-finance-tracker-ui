import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Header } from '../../../layout/header/header';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { ApiService } from '../../../shared/service/api/api-service';
import { PasswordResetRequest } from '../../../shared/models/password-reset';
import { LoaderService } from '../../../shared/service/loader-service/loader-service';
import { NotificationService } from '../../../shared/service/notification-service/notification-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule, Header, MatButton, MatCard, MatFormField, MatInput, MatLabel],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPassword {
  email = signal<string>('');
  otp = signal<string>('');
  newPassword = signal<string>('');

  step = signal<number>(1); // 1 = Request, 2 = Confirm
  isLoading = signal<boolean>(false);

  constructor(
    private readonly api: ApiService,
    private readonly loaderService: LoaderService,
    private readonly notification: NotificationService,
    private readonly router: Router
  ) {}

  onRequestOtp() {
    if (!this.email()) return;
    const data = { email: this.email() };

    this.isLoading.set(true);
    this.loaderService.show();
    this.api.requestPasswordReset(data).subscribe({
      next: (res: any) => {
        this.step.set(2);
        this.isLoading.set(false);
        this.loaderService.hide();
        this.notification.show('success', res.message);
      },
      error: (err: any) => {
        this.loaderService.hide();
        this.isLoading.set(false);
        const errorMessage = err.error?.error || 'An unexpected error occurred';
        this.notification.show('error', errorMessage);
      },
    });
  }

  onResetPassword() {
    if (!this.otp() || !this.newPassword()) return;

    this.isLoading.set(true);
    this.loaderService.show();
    const payload: PasswordResetRequest = {
      email: this.email(),
      otp: this.otp(),
      new_password: this.newPassword(),
    };

    this.api.confirmPasswordReset(payload).subscribe({
      next: (res: any) => {
        this.loaderService.hide();
        this.isLoading.set(false);
        this.notification.show('success', res.message);
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        this.loaderService.hide();
        const errorMessage = err.error?.error || 'An unexpected error occurred';
        this.notification.show('error', errorMessage);
        this.isLoading.set(false);
      },
    });
  }
}
