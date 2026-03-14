import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest, RegisterRequest } from '../../shared/models/auth-models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly api = 'http://localhost:8000/api/auth';

  constructor(private readonly http: HttpClient) {}

  login(data: LoginRequest) {
    return this.http.post(`${this.api}/login`, data);
  }

  register(data: RegisterRequest) {
    return this.http.post(`${this.api}/register/`, data);
  }

  forgotPassword(email: string) {
    return this.http.post(`${this.api}/forgot-password/`, { email });
  }

  resetPassword(data: any) {
    return this.http.post(`${this.api}/reset-password/`, data);
  }

  logout() {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
  }

  storeTokens(tokens: any) {
    localStorage.setItem('access', tokens.access);
    localStorage.setItem('refresh', tokens.refresh);
  }

  getToken() {
    return localStorage.getItem('access');
  }
}
