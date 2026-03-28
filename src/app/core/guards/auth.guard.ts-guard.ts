import { CanActivateFn } from '@angular/router';

// Auth guard - protects routes by checking if user has a valid token
export const authGuardTsGuard: CanActivateFn = (route, state) => {
  // Check if access token exists in localStorage
  const token = localStorage.getItem('access');

  // If no token found, redirect to login page
  if (!token) {
    window.location.href = '/login';
    return false;
  }

  return true;
};
