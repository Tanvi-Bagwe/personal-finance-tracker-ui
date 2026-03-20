import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  AuthResponse,
  ChangePasswordRequest,
  LoginRequest,
  RegisterRequest,
} from '../../models/auth-models';
import { AppStore } from '../app-store/app-store.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    private readonly http: HttpClient,
    private readonly store: AppStore,
  ) {}
  private readonly API_URL = 'http://localhost:8000/api';

  // Auth Endpoints
  login(data: LoginRequest) {
    return this.http.post(`${this.API_URL}/auth/login`, data);
  }

  register(data: RegisterRequest) {
    return this.http.post(`${this.API_URL}/auth/register`, data);
  }

  changePassword(data: ChangePasswordRequest) {
    return this.http.post(`${this.API_URL}/auth/change-password`, data, {
      headers: this.getHeader(),
    });
  }

  verifySession(data: AuthResponse) {
    return this.http.post(`${this.API_URL}/auth/verify`, data);
  }

  forgotPassword(email: string) {
    return this.http.post(`${this.API_URL}/forgot-password/`, { email });
  }

  resetPassword(data: any) {
    return this.http.post(`${this.API_URL}/reset-password/`, data);
  }

  logout() {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
  }

  getHeader(): HttpHeaders {
    return new HttpHeaders({
      Authorization: 'Bearer ' + this.store.access(),
    });
  }
}
