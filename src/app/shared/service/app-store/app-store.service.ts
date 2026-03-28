import { computed, effect, Injectable, signal } from '@angular/core';
import { AuthResponse } from '../../models/auth-models';

// App store service - manages global application state
@Injectable({
  providedIn: 'root',
})
export class AppStore {
  // --- STATE ---
  // Auth State
  readonly access = signal<string | null>(localStorage.getItem('access'));
  readonly refresh = signal<string | null>(localStorage.getItem('refresh'));
  readonly user = signal<any | null>(JSON.parse(localStorage.getItem('user') || 'null'));

  // UI State (Global)
  readonly isSidebarOpen = signal<boolean>(true);

  // --- COMPUTED (Derived State) ---
  // Check if user is logged in by checking if access token exists
  readonly isLoggedIn = computed(() => !!this.access());

  constructor() {
    // Effect to sync theme to localStorage whenever it changes
    effect(() => {

    });
  }

  // --- ACTIONS ---
  // Save authentication tokens to storage and state
  setAuth(res: AuthResponse) {
    localStorage.setItem('access', res.access);
    localStorage.setItem('refresh', res.refresh);
    this.access.set(res.access);
    this.refresh.set(res.refresh);
  }

  // Clear user data and logout
  logout() {
    localStorage.clear();
    this.access.set(null);
    this.refresh.set(null);
    this.user.set(null);
  }

  // Toggle sidebar open/close state
  toggleSidebar() {
    this.isSidebarOpen.update((v) => !v);
  }
}
