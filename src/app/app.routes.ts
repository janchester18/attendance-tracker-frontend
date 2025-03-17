import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { MainLayoutComponent } from './core/main-layout/main-layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { AttendanceHistoryComponent } from './features/attendance-history/attendance-history.component';
import { authGuard } from './auth.guard'; // Import your function-based guard


export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  { path: 'login', component: LoginComponent },
  {
    path: 'main',
    component: MainLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
      { path: 'attendance-history', component: AttendanceHistoryComponent, canActivate: [authGuard] },
    ],
  },
];
