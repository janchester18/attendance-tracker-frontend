import { FeaturesService } from './../../features/features.service';
import { Component, HostListener  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { SnackbarComponent } from '../../shared/snackbar/snackbar.component';
import { NotificationComponent } from "../../shared/notification/notification.component";

@Component({
  selector: 'app-admin-layout',
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatExpansionModule,
    NotificationComponent
],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {
  isNotificationPanelOpen = false;

  isMobile = window.innerWidth < 768; // ✅ Detect initial screen size
  // ✅ Update `isMobile` on window resize
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobile = event.target.innerWidth < 768;
  }
  toggleSidenav() {
    // Implement sidenav toggle logic if needed
  }

  constructor(private featureService: FeaturesService) {}

  onLogout() {
    this.featureService.handleLogout();
  }

  openNotifications() {
    this.isNotificationPanelOpen = !this.isNotificationPanelOpen;
  }
}
