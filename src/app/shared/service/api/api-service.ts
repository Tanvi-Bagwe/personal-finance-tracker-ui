import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequest, RegisterRequest } from '../../models/auth-models';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private readonly http: HttpClient) {}
  private readonly API_URL = 'http://localhost:8000/api';

  // Auth Endpoints
  login(data: LoginRequest) {
    return this.http.post(`${this.API_URL}/auth/login`, data);
  }

  register(data: RegisterRequest) {
    return this.http.post(`${this.API_URL}/register/`, data);
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
}
