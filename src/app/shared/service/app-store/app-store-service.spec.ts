import { TestBed } from '@angular/core/testing';
import { describe, it, beforeEach, expect, afterEach } from 'vitest';

import { AppStore } from './app-store.service';
import { AuthResponse } from '../../models/auth-models';

describe('AppStore', () => {
  let service: AppStore;

  const mockAuthResponse: AuthResponse = {
    access: 'test-access-token',
    refresh: 'test-refresh-token',
  };

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [AppStore],
    });

    service = TestBed.inject(AppStore);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize access signal', () => {
    expect(service.access()).toBeNull();
  });

  it('setAuth() should set access and refresh tokens', () => {
    service.setAuth(mockAuthResponse);

    expect(service.access()).toBe('test-access-token');
    expect(service.refresh()).toBe('test-refresh-token');
    expect(localStorage.getItem('access')).toBe('test-access-token');
  });

  it('logout() should clear all state', () => {
    service.setAuth(mockAuthResponse);

    service.logout();

    expect(service.access()).toBeNull();
    expect(service.refresh()).toBeNull();
    expect(localStorage.length).toBe(0);
  });

  it('toggleSidebar() should toggle sidebar state', () => {
    expect(service.isSidebarOpen()).toBe(true);

    service.toggleSidebar();
    expect(service.isSidebarOpen()).toBe(false);

    service.toggleSidebar();
    expect(service.isSidebarOpen()).toBe(true);
  });

  it('isLoggedIn computed should return true when access token exists', () => {
    service.access.set('valid-token');

    expect(service.isLoggedIn()).toBe(true);
  });

  it('isLoggedIn computed should return false when access token is null', () => {
    service.access.set(null);

    expect(service.isLoggedIn()).toBe(false);
  });
});
