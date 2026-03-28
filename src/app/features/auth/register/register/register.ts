import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Header } from '../../../../layout/header/header';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatError, MatFormField, MatHint, MatInput, MatLabel } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../../shared/service/api/api-service';
import { AppStore } from '../../../../shared/service/app-store/app-store.service';
import { MatIcon } from '@angular/material/icon';
import { RegisterRequest } from '../../../../shared/models/auth-models';
import { NotificationService } from '../../../../shared/service/notification-service/notification-service';
import { ApiResponse } from '../../../../shared/models/api-response';
import { HttpErrorResponse } from '@angular/common/http';

// Register component - handles user registration with validation
@Component({
  selector: 'app-register',
  imports: [
    FormsModule,
    Header,
    MatButton,
    MatCard,
    MatFormField,
    MatInput,
    MatLabel,
    RouterLink,
    MatIcon,
    MatCardContent,
    MatError,
    MatHint,
    ReactiveFormsModule,
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register implements OnInit {
  registerForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly api: ApiService,
    private readonly appStore: AppStore,
    private readonly router: Router,
    private readonly notification: NotificationService,
  ) {
    // Create registration form with validators for username, email, and password
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/), // One uppercase, one lowercase, one number
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

  // Handle user registration - validate form and send data to API
  onRegister() {
    // Validate form before submitting
    if (this.registerForm.invalid) {
      this.notification.show('error', 'Please fix the errors in the form.');
      return;
    }

    const registerData: RegisterRequest = {
      username: this.registerForm.value.username,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
    };

    // Call API to register user
    this.api.register(registerData).subscribe({
      next: (res: ApiResponse) => {
        this.notification.show('success', res.message || 'Registered successfully.');
        this.router.navigate(['/login']);
      },
      error: (err: HttpErrorResponse) => {
        const msg = err.error?.message || 'An unexpected error occurred';
        this.notification.show('error', msg);
      },
    });
  }
}
