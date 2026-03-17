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
  ) {}

  ngOnInit() {
    if (this.appStore.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  login() {
    this.api.login({ username: this.username, password: this.password }).subscribe({
      next: (res) => {
        this.appStore.setAuth(res);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Login failed', err);
      },
      complete: () => {},
    });
  }
}
