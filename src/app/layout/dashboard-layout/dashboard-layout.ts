import { Component, OnInit } from '@angular/core';
import { MatListModule } from '@angular/material/list'; // For mat-nav-list
import { MatIconModule } from '@angular/material/icon'; // For mat-icon
import { Router, RouterModule } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';
import { ApiService } from '../../shared/service/api/api-service';
import { AppStore } from '../../shared/service/app-store/app-store.service';
import { AuthResponse } from '../../shared/models/auth-models';
import { ApiResponse } from '../../shared/models/api-response';

@Component({
  selector: 'app-dashboard-layout',
  imports: [MatListModule, MatIconModule, RouterModule, Sidebar],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.scss',
})
export class DashboardLayout implements OnInit {
  constructor(
    private readonly api: ApiService,
    private readonly store: AppStore,
    private readonly router: Router,
  ) {}

  ngOnInit() {
    this.validateSession();
  }

  validateSession() {
    const payload: AuthResponse = {
      access: this.store.access() ?? '',
      refresh: this.store.refresh() ?? '',
    };

    this.api.verifySession(payload).subscribe({
      next: (response: ApiResponse) => {
        if (response.isSuccess && response.message === 'Access token refreshed successfully!') {
          payload.access = response.data.access;
          this.store.setAuth(payload);
        }
      },
      error: (err) => {
        // SCENARIO 3: Both tokens are invalid/expired or malformed
        console.error('Session dead:', err);
        this.store.logout();
        this.router.navigate(['/login']);
      },
    });
  }
}
