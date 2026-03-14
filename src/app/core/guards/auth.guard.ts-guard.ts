import { CanActivateFn } from '@angular/router';

export const authGuardTsGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('access');

  if (!token) {
    window.location.href = '/login';
    return false;
  }

  return true;
};
