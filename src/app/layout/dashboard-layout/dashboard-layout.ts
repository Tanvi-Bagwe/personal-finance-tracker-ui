import { Component, OnInit } from '@angular/core';
import { MatListModule } from '@angular/material/list'; // For mat-nav-list
import { MatIconModule } from '@angular/material/icon'; // For mat-icon
import { Router, RouterModule } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';
import { ApiService } from '../../shared/service/api/api-service';
import { AppStore } from '../../shared/service/app-store/app-store.service';
import { AuthResponse } from '../../shared/models/auth-models';
import { ApiResponse } from '../../shared/models/api-response';

// Dashboard layout component - handles main layout and session validation
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

  // Check session when component loads
  ngOnInit() {
    this.validateSession();
  }

  // Verify if session is still valid - refresh token if needed
  validateSession() {
    const payload: AuthResponse = {
      access: this.store.access() ?? '',
      refresh: this.store.refresh() ?? '',
    };

    this.api.verifySession(payload).subscribe({
      next: (response: ApiResponse) => {
        // If token refreshed successfully, update the stored token
        if (response.isSuccess && response.message === 'Access token refreshed successfully!') {
          payload.access = response.data.access;
          this.store.setAuth(payload);
        }
      },
      error: (err) => {
        // If both tokens are invalid, logout and redirect to login
        console.error('Session dead:', err);
        this.store.logout();
        this.router.navigate(['/login']);
      },
    });
  }
}
