import { computed, effect, Injectable, signal } from '@angular/core';

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
  readonly isDarkMode = signal<boolean>(localStorage.getItem('theme') === 'dark');
  readonly isSidebarOpen = signal<boolean>(true);

  // --- COMPUTED (Derived State) ---
  readonly isLoggedIn = computed(() => !!this.access());

  constructor() {
    // Effect to sync theme to localStorage whenever it changes
    effect(() => {
      localStorage.setItem('theme', this.isDarkMode() ? 'dark' : 'light');
      document.documentElement.classList.toggle('theme-dark', this.isDarkMode());
    });
  }

  // --- ACTIONS ---
  setAuth(res: any) {
    localStorage.setItem('access', res.access);
    localStorage.setItem('refresh', res.refresh);
    this.access.set(res.access);
    this.refresh.set(res.refresh);
  }

  logout() {
    localStorage.clear();
    this.access.set(null);
    this.user.set(null);
  }

  toggleSidebar() {
    this.isSidebarOpen.update((v) => !v);
  }

  toggleTheme() {
    this.isDarkMode.update((v) => !v);
    const host = document.documentElement; // or document.body
    if (this.isDarkMode()) {
      host.classList.add('theme-dark');
      host.classList.remove('theme-light');
    } else {
      host.classList.add('theme-light');
      host.classList.remove('theme-dark');
    }
  }
}
