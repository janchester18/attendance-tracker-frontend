import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = sessionStorage.getItem('auth_token'); // Retrieve token from local storage

  if (!token) {
    console.warn('Access denied: No token found'); // Debugging log
    router.navigate(['/login']); // Redirect to login page
    return false; // Block access
  }

  return true; // Allow access
};
