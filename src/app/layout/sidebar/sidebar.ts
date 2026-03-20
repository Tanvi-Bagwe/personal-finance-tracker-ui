import { Component, inject, OnDestroy, signal } from '@angular/core';
import { MatListModule } from '@angular/material/list'; // For mat-nav-list
import { MatIconModule } from '@angular/material/icon'; // For mat-icon
import { RouterModule } from '@angular/router';
import { MatSidenav, MatSidenavContainer, MatSidenavContent, MatSidenavModule } from '@angular/material/sidenav';
import { MediaMatcher } from '@angular/cdk/layout';
import { Header } from '../header/header';
import { AppStore } from '../../shared/service/app-store/app-store.service';

@Component({
  selector: 'app-sidebar',
  imports: [
    MatListModule,
    MatIconModule,
    RouterModule,
    MatSidenavContent,
    MatSidenavContainer,
    MatSidenav,
    MatSidenavModule,
    Header,
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar implements OnDestroy {
  protected readonly fillerNav = Array.from({ length: 5 }, (_, i) => `Nav Item ${i + 1}`);

  protected readonly isMobile = signal(true);

  private readonly _mobileQuery: MediaQueryList;
  private readonly _mobileQueryListener: () => void;

  constructor(readonly appStore: AppStore) {
    const media = inject(MediaMatcher);

    this._mobileQuery = media.matchMedia('(max-width: 600px)');
    this.isMobile.set(this._mobileQuery.matches);
    this._mobileQueryListener = () => this.isMobile.set(this._mobileQuery.matches);
    this._mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this._mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }
}
