import { computed, effect, Injectable, signal } from '@angular/core';
import { AuthResponse } from '../../models/auth-models';

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
  readonly isLoggedIn = computed(() => !!this.access());

  constructor() {
    // Effect to sync theme to localStorage whenever it changes
    effect(() => {

    });
  }

  // --- ACTIONS ---
  setAuth(res: AuthResponse) {
    localStorage.setItem('access', res.access);
    localStorage.setItem('refresh', res.refresh);
    this.access.set(res.access);
    this.refresh.set(res.refresh);
  }

  logout() {
    localStorage.clear();
    this.access.set(null);
    this.refresh.set(null);
    this.user.set(null);
  }

  toggleSidebar() {
    this.isSidebarOpen.update((v) => !v);
  }
}
