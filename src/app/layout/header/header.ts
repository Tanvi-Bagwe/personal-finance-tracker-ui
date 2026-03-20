import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatToolbar } from '@angular/material/toolbar';
import { AppStore } from '../../shared/service/app-store/app-store.service';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { Router, RouterLink } from '@angular/router';

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

  logout(): void {
    this.appStore.logout();
    this.router.navigate(['/login']);
  }
}
