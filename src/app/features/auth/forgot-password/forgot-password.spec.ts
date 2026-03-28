import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { describe, it, beforeEach, expect, vi } from 'vitest';
import { of, throwError } from 'rxjs';

import { ForgotPassword } from './forgot-password';
import { ApiService } from '../../../shared/service/api/api-service';
import { LoaderService } from '../../../shared/service/loader-service/loader-service';
import { NotificationService } from '../../../shared/service/notification-service/notification-service';
import { ApiResponse } from '../../../shared/models/api-response';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPassword;
  let fixture: ComponentFixture<ForgotPassword>;
  let apiService: {
    requestPasswordReset: ReturnType<typeof vi.fn>;
    confirmPasswordReset: ReturnType<typeof vi.fn>;
  };
  let loaderService: {
    show: ReturnType<typeof vi.fn>;
    hide: ReturnType<typeof vi.fn>;
  };
  let notificationService: { show: ReturnType<typeof vi.fn> };
  let router: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    const apiServiceMock = {
      requestPasswordReset: vi.fn(),
      confirmPasswordReset: vi.fn(),
    };
    const loaderServiceMock = {
      show: vi.fn(),
      hide: vi.fn(),
    };
    const notificationServiceMock = { show: vi.fn() };
    const routerMock = { navigate: vi.fn() };
    const activatedRouteMock = {};

    await TestBed.configureTestingModule({
      imports: [ForgotPassword, ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        { provide: ApiService, useValue: apiServiceMock },
        { provide: LoaderService, useValue: loaderServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();

    apiService = TestBed.inject(ApiService) as any;
    loaderService = TestBed.inject(LoaderService) as any;
    notificationService = TestBed.inject(NotificationService) as any;
    router = TestBed.inject(Router) as any;

    fixture = TestBed.createComponent(ForgotPassword);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('constructor should initialize otpRequestForm and passwordResetForm', () => {
    expect(component.otpRequestForm).toBeDefined();
    expect(component.passwordResetForm).toBeDefined();
    expect(component.step()).toBe(1);
  });

  it('onRequestOtp() should show error if form is invalid', () => {
    component.otpRequestForm.patchValue({ email: '' });

    component.onRequestOtp();

    expect(notificationService.show).toHaveBeenCalledWith(
      'error',
      'Please fix the errors in the form.',
    );
    expect(apiService.requestPasswordReset).not.toHaveBeenCalled();
  });

  it('onRequestOtp() should call API with valid email', () => {
    const mockResponse: ApiResponse = { data: null, message: 'OTP sent' };

    component.otpRequestForm.patchValue({ email: 'test@example.com' });
    apiService.requestPasswordReset.mockReturnValue(of(mockResponse));

    component.onRequestOtp();

    expect(apiService.requestPasswordReset).toHaveBeenCalledWith({
      email: 'test@example.com',
    });
    expect(loaderService.show).toHaveBeenCalled();
  });

  it('onRequestOtp() should advance to step 2 on success', () => {
    const mockResponse: ApiResponse = { data: null, message: 'OTP sent' };

    component.otpRequestForm.patchValue({ email: 'test@example.com' });
    apiService.requestPasswordReset.mockReturnValue(of(mockResponse));

    component.onRequestOtp();

    expect(component.step()).toBe(2);
    expect(loaderService.hide).toHaveBeenCalled();
  });

  it('onRequestOtp() should show error on API failure', () => {
    component.otpRequestForm.patchValue({ email: 'test@example.com' });
    apiService.requestPasswordReset.mockReturnValue(
      throwError(() => ({ error: { error: 'Email not found' } })),
    );

    component.onRequestOtp();

    expect(notificationService.show).toHaveBeenCalledWith('error', 'Email not found');
    expect(loaderService.hide).toHaveBeenCalled();
  });

  it('onResetPassword() should show error if form is invalid', () => {
    component.passwordResetForm.patchValue({
      newPassword: '',
      otp: '',
    });

    component.onResetPassword();

    expect(notificationService.show).toHaveBeenCalledWith(
      'error',
      'Please fix the errors in the form.',
    );
    expect(apiService.confirmPasswordReset).not.toHaveBeenCalled();
  });

  it('onResetPassword() should call API with valid form data', () => {
    const mockResponse: ApiResponse = { data: null, message: 'Password reset' };

    component.email.set('test@example.com');
    component.passwordResetForm.patchValue({
      newPassword: 'NewPassword123',
      otp: '123456',
    });
    apiService.confirmPasswordReset.mockReturnValue(of(mockResponse));

    component.onResetPassword();

    expect(apiService.confirmPasswordReset).toHaveBeenCalled();
    expect(loaderService.show).toHaveBeenCalled();
  });

  it('onResetPassword() should navigate to login on success', () => {
    const mockResponse: ApiResponse = { data: null, message: 'Success' };

    component.email.set('test@example.com');
    component.passwordResetForm.patchValue({
      newPassword: 'NewPassword123',
      otp: '123456',
    });
    apiService.confirmPasswordReset.mockReturnValue(of(mockResponse));

    component.onResetPassword();

    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('onResetPassword() should show error on API failure', () => {
    component.email.set('test@example.com');
    component.passwordResetForm.patchValue({
      newPassword: 'NewPassword123',
      otp: '123456',
    });
    apiService.confirmPasswordReset.mockReturnValue(
      throwError(() => ({ error: { error: 'Invalid OTP' } })),
    );

    component.onResetPassword();

    expect(notificationService.show).toHaveBeenCalledWith('error', 'Invalid OTP');
    expect(loaderService.hide).toHaveBeenCalled();
  });
});
