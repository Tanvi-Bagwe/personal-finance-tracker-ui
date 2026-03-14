import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list'; // For mat-nav-list
import { MatIconModule } from '@angular/material/icon'; // For mat-icon
import { RouterModule } from '@angular/router';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { Sidebar } from '../sidebar/sidebar';
import { Header } from '../header/header';

@Component({
  selector: 'app-dashboard-layout',
  imports: [
    MatListModule,
    MatIconModule,
    RouterModule,
    MatSidenavContainer,
    MatSidenav,
    Sidebar,
    MatSidenavContent,
    Header,
  ],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css',
})
export class DashboardLayout {}
