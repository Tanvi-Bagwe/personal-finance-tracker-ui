import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatCard } from '@angular/material/card';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { Header } from '../../../layout/header/header';
import { ApiService } from '../../../shared/service/api/api-service';
import { AppStore } from '../../../shared/service/app-store/app-store.service';
import { NotificationService } from '../../../shared/service/notification-service/notification-service';
import { AuthResponse, LoginRequest } from '../../../shared/models/auth-models';
import { ApiResponse } from '../../../shared/models/api-response';
import { HttpErrorResponse } from '@angular/common/http';

// Login component - handles user login with username and password
@Component({
  selector: 'app-login',
  imports: [
    MatCard,
    MatFormField,
    MatLabel,
    MatFormField,
    MatInput,
    FormsModule,
    MatButton,
    Header,
    RouterLink,
    ReactiveFormsModule,
    MatError,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  loginForm: FormGroup;

  protected password: any;
  protected username: any;
  constructor(
    private readonly fb: FormBuilder,
    private readonly api: ApiService,
    private readonly appStore: AppStore,
    private readonly router: Router,
    private readonly notification: NotificationService,
  ) {
    // Build login form with validators for username and password
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/),
        ],
      ],
    });
  }

  // Check if user is already logged in and redirect to dashboard
  ngOnInit() {
    if (this.appStore.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  // Handle user login - validate form and authenticate user
  login() {
    // Validate form before submitting
    if (this.loginForm.invalid) {
      this.notification.show('error', 'Please fix the errors in the form.');
      return;
    }
    const data: LoginRequest = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password,
    };

    // Call API to login and store tokens
    this.api.login(data).subscribe({
      next: (res: ApiResponse) => {
        const payload: AuthResponse = {
          access: res.data.access,
          refresh: res.data.refresh,
        };
        this.appStore.setAuth(payload);
        this.notification.show('success', res.message || 'Login successfully');
        this.router.navigate(['/dashboard']);
      },
      error: (err: HttpErrorResponse) => {
        const msg = err.error?.message || 'An unexpected error occurred';
        this.notification.show('error', msg);
      },
    });
  }
}
