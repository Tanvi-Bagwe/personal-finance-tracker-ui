import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list'; // For mat-nav-list
import { MatIconModule } from '@angular/material/icon'; // For mat-icon
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [MatListModule, MatIconModule, RouterModule, RouterLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {}
