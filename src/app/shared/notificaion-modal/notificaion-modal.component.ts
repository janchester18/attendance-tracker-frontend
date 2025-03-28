import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FeaturesService } from '../../features/features.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoaderService } from '../../loader.service';

@Component({
  selector: 'app-notificaion-modal',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatDialogModule],
  templateUrl: './notificaion-modal.component.html',
  styleUrl: './notificaion-modal.component.css'
})
export class NotificationModalComponent implements OnInit {
  notificationDetails: any;
  loading = true;

  constructor(
    private dialogRef: MatDialogRef<NotificationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { notificationId: string },
    private featuresService: FeaturesService,
    private loaderService: LoaderService
  ) {}

  ngOnInit() {
    this.fetchNotificationDetails();
  }

  fetchNotificationDetails() {
      // Disable global loader
    this.loaderService.hide();
    this.featuresService.getNotificationDetails(this.data.notificationId).subscribe(
      (res) => {
        this.notificationDetails = res.data;
        this.loading = false;
      },
      () => {
        this.loading = false;
      }
    );
  }

  closeModal() {
    this.dialogRef.close();
  }
}