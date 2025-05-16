import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { FeaturesService } from './features/features.service';
import { SnackbarComponent } from './shared/snackbar/snackbar.component';
import { SnackbarService } from './shared/snackbar/snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private featuresService: FeaturesService,
    private router: Router,
    private snackbarService: SnackbarService,
  ) {}

  canActivate(): Observable<boolean> {
    // For example, get the user role from the AuthService (which might extract it from token or session storage)
    return this.featuresService.getUserRole().pipe(
      map(role => {
        if (role === 'Admin') {
          return true;
        } else {
          // Redirect to employee dashboard or show an unauthorized message
          this.snackbarService.showError("Access denied. You are not authorized to view the admin dashboard.");
          this.router.navigate(['/main/dashboard']);
          return false;
        }
      }),
      catchError(() => {
        // In case of error, redirect or deny access
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }
}
