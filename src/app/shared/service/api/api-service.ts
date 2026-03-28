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
import { CreateTransactionRequest, Transaction } from '../../models/transaction.model';
import { CreateReminderRequest, ReminderMoel } from '../../models/reminder.model';
import { PasswordResetRequest } from '../../models/password-reset';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    private readonly http: HttpClient,
    private readonly store: AppStore,
  ) {}
  private readonly API_URL = environment.apiUrl;

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

  getCategories() {
    return this.http.get(`${this.API_URL}/category/`, { headers: this.getHeader() });
  }

  createCategory(createCategoryRequest: CreateCategoryRequest) {
    return this.http.post(`${this.API_URL}/category/create`, createCategoryRequest, {
      headers: this.getHeader(),
    });
  }

  deleteCategory(id: number) {
    return this.http.delete(`${this.API_URL}/category/${id}/delete`, { headers: this.getHeader() });
  }

  deleteTransaction(id: number) {
    return this.http.delete(`${this.API_URL}/transactions/${id}/delete`, {
      headers: this.getHeader(),
    });
  }

  createTransaction(newTransaction: CreateTransactionRequest) {
    return this.http.post(`${this.API_URL}/transactions/create`, newTransaction, {
      headers: this.getHeader(),
    });
  }

  getTransactions() {
    return this.http.get(`${this.API_URL}/transactions/`, { headers: this.getHeader() });
  }

  updateTransaction(data: Transaction) {
    return this.http.put(`${this.API_URL}/transactions/${data.id}/update`, data, {
      headers: this.getHeader(),
    });
  }

  deleteReminder(id: number) {
    return this.http.delete(`${this.API_URL}/reminders/${id}/delete`, {
      headers: this.getHeader(),
    });
  }

  updateReminderAction(id: number, data: any) {
    return this.http.patch(`${this.API_URL}/reminders/${id}/action`, data, {
      headers: this.getHeader(),
    });
  }

  createReminder(newReminder: CreateReminderRequest) {
    return this.http.post(`${this.API_URL}/reminders/create`, newReminder, {
      headers: this.getHeader(),
    });
  }

  getReminders() {
    return this.http.get(`${this.API_URL}/reminders/`, { headers: this.getHeader() });
  }

  updateReminder(id: number, data: ReminderMoel) {
    return this.http.put(`${this.API_URL}/reminders/${id}/update`, data, {
      headers: this.getHeader(),
    });
  }

  requestPasswordReset(data: any) {
    return this.http.post(`${this.API_URL}/auth/otp-request`, data);
  }

  confirmPasswordReset(data: PasswordResetRequest) {
    return this.http.post(`${this.API_URL}/auth/otp-confirm`, data);
  }

  getDashboardSummary() {
    return this.http.get(`${this.API_URL}/dashboard/summary`, { headers: this.getHeader() });
  }

  getHeader(): HttpHeaders {
    return new HttpHeaders({
      Authorization: 'Bearer ' + this.store.access(),
    });
  }
}
