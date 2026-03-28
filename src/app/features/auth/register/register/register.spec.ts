import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { describe, it, beforeEach, expect, vi } from 'vitest';
import { of, throwError } from 'rxjs';

import { Register } from './register';
import { ApiService } from '../../../../shared/service/api/api-service';
import { AppStore } from '../../../../shared/service/app-store/app-store.service';
import { NotificationService } from '../../../../shared/service/notification-service/notification-service';
import { ApiResponse } from '../../../../shared/models/api-response';

describe('RegisterComponent', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;
  let apiService: { register: ReturnType<typeof vi.fn> };
  let appStore: { isLoggedIn: ReturnType<typeof vi.fn> };
  let router: { navigate: ReturnType<typeof vi.fn> };
  let notificationService: { show: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    const apiServiceMock = { register: vi.fn() };
    const appStoreMock = { isLoggedIn: vi.fn().mockReturnValue(false) };
    const routerMock = { navigate: vi.fn() };
    const notificationServiceMock = { show: vi.fn() };
    const activatedRouteMock = {};

    await TestBed.configureTestingModule({
      imports: [Register, ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        { provide: ApiService, useValue: apiServiceMock },
        { provide: AppStore, useValue: appStoreMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: NotificationService, useValue: notificationServiceMock },
      ],
    }).compileComponents();

    apiService = TestBed.inject(ApiService) as any;
    appStore = TestBed.inject(AppStore) as any;
    router = TestBed.inject(Router) as any;
    notificationService = TestBed.inject(NotificationService) as any;

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('constructor should initialize registerForm with validators', () => {
    expect(component.registerForm).toBeDefined();
    expect(component.registerForm.get('username')).toBeDefined();
    expect(component.registerForm.get('email')).toBeDefined();
    expect(component.registerForm.get('password')).toBeDefined();
  });

  it('ngOnInit() should redirect to dashboard if already logged in', () => {
    appStore.isLoggedIn.mockReturnValue(true);

    component.ngOnInit();

    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('onRegister() should show error if form is invalid', () => {
    component.registerForm.patchValue({
      username: '',
      email: '',
      password: '',
    });

    component.onRegister();

    expect(notificationService.show).toHaveBeenCalledWith(
      'error',
      'Please fix the errors in the form.',
    );
    expect(apiService.register).not.toHaveBeenCalled();
  });

  it('onRegister() should call API with valid form data', () => {
    const mockResponse: ApiResponse = { data: null, message: 'Registered successfully.' };

    component.registerForm.patchValue({
      username: 'testuser',
      email: 'test@example.com',
      password: 'Password123',
    });

    apiService.register.mockReturnValue(of(mockResponse));

    component.onRegister();

    expect(apiService.register).toHaveBeenCalledWith({
      username: 'testuser',
      email: 'test@example.com',
      password: 'Password123',
    });
  });

  it('onRegister() should navigate to login on success', () => {
    const mockResponse: ApiResponse = { data: null, message: 'Success' };

    component.registerForm.patchValue({
      username: 'testuser',
      email: 'test@example.com',
      password: 'Password123',
    });

    apiService.register.mockReturnValue(of(mockResponse));

    component.onRegister();

    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('onRegister() should show error on API failure', () => {
    component.registerForm.patchValue({
      username: 'testuser',
      email: 'test@example.com',
      password: 'Password123',
    });

    apiService.register.mockReturnValue(
      throwError(() => ({ error: { message: 'User already exists' } })),
    );

    component.onRegister();

    expect(notificationService.show).toHaveBeenCalledWith('error', 'User already exists');
  });
});
