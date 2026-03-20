import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatCard } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { Header } from '../../../layout/header/header';
import { ApiService } from '../../../shared/service/api/api-service';
import { AppStore } from '../../../shared/service/app-store/app-store.service';
import { NotificationService } from '../../../shared/service/notification-service/notification-service';
import { AuthResponse } from '../../../shared/models/auth-models';

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
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  protected password: any;
  protected username: any;
  constructor(
    private readonly api: ApiService,
    private readonly appStore: AppStore,
    private readonly router: Router,
    private readonly notification: NotificationService,
  ) {}

  ngOnInit() {
    if (this.appStore.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  login() {

    this.api.login({ username: this.username, password: this.password }).subscribe({
      next: (res: any) => {
        const payload: AuthResponse = {
          access: res.access,
          refresh: res.refresh,
        };
        this.appStore.setAuth(payload);
        this.notification.show('success', 'Login successful!');
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.notification.show('error', 'Login failed: Invalid credentials');
      },
    });
  }
}
