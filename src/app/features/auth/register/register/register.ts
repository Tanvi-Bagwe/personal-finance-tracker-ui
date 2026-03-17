import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Header } from '../../../../layout/header/header';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../../shared/service/api/api-service';
import { AppStore } from '../../../../shared/service/app-store/app-store.service';
import { MatIcon } from '@angular/material/icon';
import { RegisterRequest } from '../../../../shared/models/auth-models';
import { NotificationService } from '../../../../shared/service/notification-service/notification-service';

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
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register implements OnInit {
  constructor(
    private readonly api: ApiService,
    private readonly appStore: AppStore,
    private readonly router: Router,
    private readonly notification: NotificationService,
  ) {}
  registerData: RegisterRequest = {
    username: '',
    email: '',
    password: '',
  };

  ngOnInit() {
    if (this.appStore.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onRegister() {
    this.api.register(this.registerData).subscribe({
      next: () => {
        this.notification.show('success', 'Registration successful!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.notification.show('error', 'Registration failed');
      },
    });
  }
}
