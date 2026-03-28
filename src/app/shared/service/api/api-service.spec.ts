import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';

import { AppStore } from '../app-store/app-store.service';
import { ApiService } from '../api/api-service';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  const API_URL = 'http://localhost:8000/api';
  const MOCK_TOKEN = 'test-token';

  beforeEach(() => {
    const appStoreMock = {
      access: vi.fn().mockReturnValue(MOCK_TOKEN),
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService, { provide: AppStore, useValue: appStoreMock }],
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('login() should POST to /auth/login', () => {
    service.login({ username: 'user', password: 'pass' }).subscribe();

    const req = httpMock.expectOne(`${API_URL}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('register() should POST to /auth/register', () => {
    service.register({ username: 'user', email: 'user@example.com', password: 'pass' }).subscribe();

    const req = httpMock.expectOne(`${API_URL}/auth/register`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('changePassword() should POST to /auth/change-password with header', () => {
    service.changePassword({ old_password: 'old', new_password: 'new' }).subscribe();

    const req = httpMock.expectOne(`${API_URL}/auth/change-password`);
    expect(req.request.headers.has('Authorization')).toBe(true);
    req.flush({});
  });

  it('verifySession() should POST to /auth/verify', () => {
    service.verifySession({ access: 'token', refresh: 'token' }).subscribe();

    const req = httpMock.expectOne(`${API_URL}/auth/verify`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('forgotPassword() should POST email to /forgot-password/', () => {
    service.forgotPassword('user@example.com').subscribe();

    const req = httpMock.expectOne(`${API_URL}/forgot-password/`);
    expect(req.request.body.email).toBe('user@example.com');
    req.flush({});
  });

  it('resetPassword() should POST to /reset-password/', () => {
    service.resetPassword({ token: 'token', password: 'pass' }).subscribe();

    const req = httpMock.expectOne(`${API_URL}/reset-password/`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('getCategories() should GET from /category/', () => {
    service.getCategories().subscribe();

    const req = httpMock.expectOne(`${API_URL}/category/`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.has('Authorization')).toBe(true);
    req.flush({});
  });

  it('createCategory() should POST to /category/create', () => {
    service.createCategory({ name: 'Groceries', type: 'expense' }).subscribe();

    const req = httpMock.expectOne(`${API_URL}/category/create`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('deleteCategory() should DELETE /category/{id}/delete', () => {
    service.deleteCategory(1).subscribe();

    const req = httpMock.expectOne(`${API_URL}/category/1/delete`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('getTransactions() should GET from /transactions/', () => {
    service.getTransactions().subscribe();

    const req = httpMock.expectOne(`${API_URL}/transactions/`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.has('Authorization')).toBe(true);
    req.flush({});
  });

  it('createTransaction() should POST to /transactions/create', () => {
    const transaction = {
      amount: 50,
      category_id: 1,
      type: 'expense',
      description: 'test',
      date: '2026-03-28',
    };
    service.createTransaction(transaction).subscribe();

    const req = httpMock.expectOne(`${API_URL}/transactions/create`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('deleteTransaction() should DELETE /transactions/{id}/delete', () => {
    service.deleteTransaction(1).subscribe();

    const req = httpMock.expectOne(`${API_URL}/transactions/1/delete`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('getReminders() should GET from /reminders/', () => {
    service.getReminders().subscribe();

    const req = httpMock.expectOne(`${API_URL}/reminders/`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.has('Authorization')).toBe(true);
    req.flush({});
  });

  it('createReminder() should POST to /reminders/create', () => {
    const reminder = {
      title: 'Pay bills',
      amount: 100,
      due_date: '2026-04-01',
      reminder_days_before: 3,
    };
    service.createReminder(reminder).subscribe();

    const req = httpMock.expectOne(`${API_URL}/reminders/create`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('updateReminder() should PUT to /reminders/{id}/update', () => {
    const reminder = {
      id: 1,
      title: 'Pay bills',
      amount: 100,
      due_date: '2026-04-01',
      reminder_days_before: 3,
      is_read: false,
      is_completed: false,
    };
    service.updateReminder(1, reminder).subscribe();

    const req = httpMock.expectOne(`${API_URL}/reminders/1/update`);
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });

  it('deleteReminder() should DELETE /reminders/{id}/delete', () => {
    service.deleteReminder(1).subscribe();

    const req = httpMock.expectOne(`${API_URL}/reminders/1/delete`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('updateReminderAction() should PATCH /reminders/{id}/action', () => {
    service.updateReminderAction(1, { is_read: true }).subscribe();

    const req = httpMock.expectOne(`${API_URL}/reminders/1/action`);
    expect(req.request.method).toBe('PATCH');
    req.flush({});
  });

  it('requestPasswordReset() should POST to /auth/otp-request', () => {
    service.requestPasswordReset({ email: 'user@example.com' }).subscribe();

    const req = httpMock.expectOne(`${API_URL}/auth/otp-request`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('getDashboardSummary() should GET from /dashboard/summary', () => {
    service.getDashboardSummary().subscribe();

    const req = httpMock.expectOne(`${API_URL}/dashboard/summary`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.has('Authorization')).toBe(true);
    req.flush({});
  });

  it('getHeader() should return HttpHeaders with Bearer token', () => {
    const headers = service.getHeader();

    expect(headers.get('Authorization')).toBe(`Bearer ${MOCK_TOKEN}`);
  });
});
