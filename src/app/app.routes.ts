import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { DashboardLayout } from './layout/dashboard-layout/dashboard-layout';
import { authGuardTsGuard } from './core/guards/auth.guard.ts-guard';
import { Register } from './features/auth/register/register/register';
import { ChangePassword } from './layout/change-password/change-password';
import { CategoriesComponent } from './features/categories/categories';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
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
      { path: 'change-password', component: ChangePassword },
       { path: "categories", component: CategoriesComponent },
      /* { path: "transactions", component: TransactionsComponent } */
    ],
  },
];
