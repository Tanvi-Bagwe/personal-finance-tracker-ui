import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatToolbar } from '@angular/material/toolbar';
import { AppStore } from '../../shared/service/app-store/app-store.service';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { Router, RouterLink } from '@angular/router';

// Header component - displays top navigation bar and logout button
@Component({
  selector: 'app-header',
  imports: [MatIcon, MatIconButton, MatToolbar, MatMenu, MatMenuTrigger, MatMenuItem, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  constructor(
    readonly appStore: AppStore,
    private readonly router: Router,
  ) {}

  // Logout user and redirect to login page
  logout(): void {
    this.appStore.logout();
    this.router.navigate(['/login']);
  }
}
