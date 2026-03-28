import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { DashboardLayout } from './layout/dashboard-layout/dashboard-layout';
import { authGuardTsGuard } from './core/guards/auth.guard.ts-guard';
import { Register } from './features/auth/register/register/register';
import { ChangePassword } from './layout/change-password/change-password';
import { CategoriesComponent } from './features/categories/categories';
import { TransactionsComponent } from './features/transactions/transactions';
import { Reminder } from './features/reminder/reminder';
import { DashboardHome } from './features/dashboard-home/dashboard-home';
import { ForgotPassword } from './features/auth/forgot-password/forgot-password';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'forgot-password',
    component: ForgotPassword,
  },
  {
    path: 'register',
    component: Register,
  },

  {
    path: 'dashboard',
    component: DashboardLayout,
    canActivate: [authGuardTsGuard],
    children: [
      { path: '', component: DashboardHome },
      { path: 'change-password', component: ChangePassword },
      { path: 'categories', component: CategoriesComponent },
      { path: 'transactions', component: TransactionsComponent },
      { path: 'reminders', component: Reminder },
    ],
  },
];
