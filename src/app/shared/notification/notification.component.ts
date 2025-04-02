import { Component, HostListener, OnInit } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { NgIf, NgFor } from '@angular/common';
import { FeaturesService } from '../../features/features.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { LoaderService } from '../../loader.service';
import { DatePipe } from '@angular/common';
import { NotificationModalComponent } from '../notificaion-modal/notificaion-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-notification',
  imports: [MatMenuModule, MatButtonModule, MatIconModule, MatBadgeModule, NgIf, NgFor, MatProgressSpinnerModule, DatePipe],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent implements OnInit{
  notifications: any[] = [];
  isRefreshing = false;  // New State for Refresh Indicator
  loadingMore = false;
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;
  unreadCount = 0;

  private isPulling = false; // Detects if user is pulling (mobile)
  private lastRefreshTime = 0; // Prevents spamming refresh
  private startY = 0; // Starting touch Y position


  constructor(private featuresService: FeaturesService, private loaderService: LoaderService, private dialog: MatDialog) {}

  ngOnInit() {
    this.fetchNotifications();
  }

  fetchNotifications() {
    if (this.loadingMore || this.currentPage > this.totalPages) return;

    this.loadingMore = true;

    // Disable global loader
    this.loaderService.hide();

    this.featuresService.getSelfNotifications(this.currentPage, this.pageSize).subscribe(
      (res: any) => {
        this.notifications = [...this.notifications, ...res.data.notifications];
        this.totalPages = res.data.totalPages;
        this.currentPage++;
        this.loadingMore = false;
        this.unreadCount = res.data.unreadCount;
      },
      () => {
        this.loadingMore = false;
      }
    );
  }

  openNotificationModal(notificationId: string) {
    this.dialog.open(NotificationModalComponent, {
      width: '400px',
      data: { notificationId },
    });
  }

  // Detect when user starts pulling
  onTouchStart(event: TouchEvent) {
    if (this.isRefreshing) return; // Ignore if already refreshing

    const element = event.target as HTMLElement;
    if (element.scrollTop === 0) {
      this.startY = event.touches[0].clientY; // Record start position
      this.isPulling = true;
    }
  }

  // Detect pulling motion
  onTouchMove(event: TouchEvent) {
    if (!this.isPulling) return;

    const currentY = event.touches[0].clientY;
    const pullDistance = currentY - this.startY;

    if (pullDistance > 50) { // Adjust threshold as needed
      this.refreshNotifications();
      this.isPulling = false;
    }
  }

  // Reset pull state
  onTouchEnd() {
    this.isPulling = false;
  }

  // **Detect Mouse Scroll-Up for Refresh on PC**
  onMouseWheel(event: WheelEvent) {
    if (event.deltaY < 0) { // User scrolls up
      this.refreshNotifications();
    }
  }

  refreshNotifications() {
    const now = Date.now();
    if (this.isRefreshing || now - this.lastRefreshTime < 2000) return; // Prevent spamming

    this.isRefreshing = true;
    this.lastRefreshTime = now;

    this.featuresService.getSelfNotifications(1, this.pageSize).subscribe(
      (res: any) => {
        this.notifications = res.data.notifications; // Replace old notifications
        this.totalPages = res.data.totalPages;
        this.currentPage = 2; // Reset pagination
        this.unreadCount = res.data.unreadCount;

        setTimeout(() => {
          this.isRefreshing = false; // Hide Refresh Indicator
        }, 1000);
      },
      () => {
        this.isRefreshing = false;
      }
    );
  }

  onScroll(event: any) {
    const element = event.target;

    // **SCROLL UP TO REFRESH**
    if (element.scrollTop === 0) {
      this.refreshNotifications();
    }

    // **SCROLL DOWN TO LOAD MORE**
    if (element.scrollHeight - element.scrollTop <= element.clientHeight + 10) {
      this.fetchNotifications();
    }
  }
}
