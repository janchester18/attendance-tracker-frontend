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
  loadingMore = false;
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;
  unreadCount = 0;

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

  onScroll(event: any) {
    const element = event.target;
    if (element.scrollHeight - element.scrollTop <= element.clientHeight + 10) {
      this.fetchNotifications();
    }
  }
}
