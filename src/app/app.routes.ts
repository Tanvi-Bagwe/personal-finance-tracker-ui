import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { DashboardLayout } from './layout/dashboard-layout/dashboard-layout';
import { authGuardTsGuard } from './core/guards/auth.guard.ts-guard';
import { Register } from './features/auth/register/register/register';

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
    path: '',
    component: DashboardLayout,
    canActivate: [authGuardTsGuard],
    children: [
      { path: 'dashboard', component: DashboardLayout },
      /* { path: "categories", component: Categ }, */
      /* { path: "transactions", component: TransactionsComponent } */
    ],
  },
];
