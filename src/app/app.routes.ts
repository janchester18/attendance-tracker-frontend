import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { MainLayoutComponent } from './core/main-layout/main-layout.component';
import { DashboardComponent } from './features/employee/dashboard/dashboard.component';
import { AttendanceHistoryComponent } from './features/employee/attendance-history/attendance-history.component';
import { authGuard } from './auth.guard'; // Import your function-based guard
import { OvertimeComponent } from './features/employee/overtime/overtime.component';
import { LeaveComponent } from './features/employee/leave/leave.component';
import { AdminLayoutComponent } from './core/admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './features/admin/admin-dashboard/admin-dashboard.component';
import { AdminGuard } from './admin.guard';
import { NotFoundComponent } from './notfound.component';
import { EmployeeGuard } from './employee.guard';
import { AttendanceRecordsComponent } from './features/admin/attendance-records/attendance-records.component';
import { OvertimeRequestsComponent } from './features/admin/overtime-requests/overtime-requests.component';
import { LeaveRequestsComponent } from './features/admin/leave-requests/leave-requests.component';
import { UserManagementComponent } from './features/admin/user-management/user-management.component';


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
      { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard, EmployeeGuard] },
      { path: 'attendance-history', component: AttendanceHistoryComponent, canActivate: [authGuard, EmployeeGuard] },
      { path: 'overtime', component: OvertimeComponent, canActivate: [authGuard, EmployeeGuard] },
      { path: 'leave', component: LeaveComponent, canActivate: [authGuard, EmployeeGuard] },
    ],
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: 'dashboard', component: AdminDashboardComponent, canActivate: [authGuard, AdminGuard] },
      { path: 'attendance-records', component: AttendanceRecordsComponent, canActivate: [authGuard, AdminGuard] },
      { path: 'overtime-requests', component: OvertimeRequestsComponent, canActivate: [authGuard, AdminGuard] },
      { path: 'leave-requests', component: LeaveRequestsComponent, canActivate: [authGuard, AdminGuard] },
      { path: 'user-management', component: UserManagementComponent, canActivate: [authGuard, AdminGuard] },
    ],
  },

  // Wildcard route for a 404 page should be the last route.
  { path: '**', component: NotFoundComponent },
];
