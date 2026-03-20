import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  AuthResponse,
  ChangePasswordRequest,
  LoginRequest,
  RegisterRequest,
} from '../../models/auth-models';
import { AppStore } from '../app-store/app-store.service';
import { CreateCategoryRequest } from '../../models/category.model';

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

  getCategories() {
    return this.http.get(`${this.API_URL}/category/`, { headers: this.getHeader() });
  }

  createCategory(createCategoryRequest: CreateCategoryRequest) {
    return this.http.post(`${this.API_URL}/category/create`, createCategoryRequest, { headers: this.getHeader() });
  }

  deleteCategory(id: number) {
    return this.http.delete(`${this.API_URL}/category/${id}/delete`, { headers: this.getHeader() });
  }

  getHeader(): HttpHeaders {
    return new HttpHeaders({
      Authorization: 'Bearer ' + this.store.access(),
    });
  }
}
