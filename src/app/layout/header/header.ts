import { Component, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatToolbar } from '@angular/material/toolbar';

@Component({
  selector: 'app-header',
  imports: [MatIcon, MatIconButton, MatToolbar],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  darkMode = signal(false);

  toggleDarkMode() {
    this.darkMode.update((v) => !v);
    const host = document.documentElement; // or document.body
    if (this.darkMode()) {
      host.classList.add('theme-dark');
      host.classList.remove('theme-light');
    } else {
      host.classList.add('theme-light');
      host.classList.remove('theme-dark');
    }
  }
}
