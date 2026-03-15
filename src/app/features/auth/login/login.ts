import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth-service';
import { Router } from '@angular/router';
import { MatCard } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { Header } from '../../../layout/header/header';

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
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  protected password: any;
  protected username: any;
  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
  ) {}

  login() {
    this.auth
      .login({
        username: this.username,
        password: this.password,
      })
      .subscribe((res: any) => {
        this.auth.storeTokens(res);

        this.router.navigate(['/dashboard']);
      });
  }
}
