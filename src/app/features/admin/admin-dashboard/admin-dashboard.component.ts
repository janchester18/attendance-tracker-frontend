import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { SnackbarComponent } from "../../../shared/snackbar/snackbar.component";
import { Geolocation } from '@capacitor/geolocation'; // If using Capacitor for location
import { FeaturesService } from '../../features.service';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { CustomPaginatorComponent } from '../../../shared/custom-paginator/custom-paginator.component';
import { MatPaginator } from '@angular/material/paginator';
import { LoaderComponent } from "../../../shared/loader/loader.component";
import { LoaderService } from '../../../loader.service';

interface AttendanceRecord {
  id: number;
  message: string;
  timestamp: string;
  type: string;
  employeeName: string;
  action: string;
  time: Date;
}

@Component({
  selector: 'app-admin-dashboard',
  imports: [MatButtonModule, MatTableModule, CommonModule, MatCardModule, CustomPaginatorComponent, LoaderComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  recentAttendanceRecords: AttendanceRecord[] = [];

  currentDate: string = '';
  currentTime: string = '';
  totalEmployees: number = 10;
  presentEmployees: number = 9;
  onLeaveEmployees: number = 1;
  paginationInfo: any = null;

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  totalRecords: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;

  totalUsers: number = 0;
  approvedLeavesToday: number = 0;
  attendanceToday: number = 0;

  constructor(
    private featuresService: FeaturesService,
    private snackbarService: SnackbarService,
    private loaderService: LoaderService
  ) { }

  ngOnInit(): void {
    this.updateTime();
    setInterval(() => this.updateTime(), 1000); // Update clock every second

    this.fetchAttendanceLogs();
  }

  fetchAttendanceLogs(page: number = this.currentPage, pageSize: number = this.pageSize, showLoader: boolean = true): void {
    if (showLoader) {
      this.loaderService.show();
    }
    this.featuresService.getAllLogs(page, pageSize).subscribe({
      next: response => {
        if (response.status === 'SUCCESS') {
          this.recentAttendanceRecords = response.data.data.map((log: any) => {
            const matches = log.message.match(/"([^"]+)" (.+) at/);
            return {
              id: log.id,
              message: log.message,
              timestamp: log.timestamp,
              type: log.type,
              employeeName: matches ? matches[1] : 'Unknown',
              action: matches ? matches[2] : 'Unknown action',
              time: new Date(log.timestamp)
            };
          });

          // Update pagination info
          this.totalRecords = response.data.totalRecords;
          this.currentPage = response.data.currentPage;
          this.pageSize = response.data.pageSize;
          this.totalUsers = response.data.totalUsers;
          this.attendanceToday = response.data.attendanceToday;
          this.approvedLeavesToday = response.data.approvedLeavesToday;
        }
        if (showLoader) {
          this.loaderService.hide();
        }
      },
      error: error => {
        console.error('Error fetching attendance logs:', error);
        if (showLoader) {
          this.loaderService.hide();
        }
      }
    });
  }



  // Handle Page Change
  onPageChange(newPage: number) {
    console.log('📢 Changing to Page:', newPage);
    this.fetchAttendanceLogs(newPage, this.pageSize, false);
  }

  // Handle Page Size Change
  onPageSizeChange(newSize: number) {
    console.log('🔄 Changing Page Size:', newSize);
    this.pageSize = newSize;
    this.currentPage = 1; // Reset to first page
    this.fetchAttendanceLogs(1, newSize, false);
  }


  updateTime() {
    const now = new Date();

    // Format date: Monday, January 01, 2025
    this.currentDate = now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    });

    // Format time: 12:34:56 PM
    this.currentTime = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  }


  async clockIn() {
    try {
      // Get user's location
      const coordinates = await Geolocation.getCurrentPosition();
      const latitude = coordinates.coords.latitude;
      const longitude = coordinates.coords.longitude;

      // Call the clock-in function
      this.featuresService.clockIn(latitude, longitude).subscribe({
        next: (response: any) => {
          if (!response) {
            this.snackbarService.showError("No response from server. Please try again.");
            return;
          }
          if (response.status === "SUCCESS") {
            this.snackbarService.showSuccess(response.message);

          } else {
            this.snackbarService.showError("Something went wrong. Try again.");
          }
        },
        error: (error) => {
          this.snackbarService.showError(error || "Clock-in failed. Please try again.");
        }
      });
    } catch (error) {
      this.snackbarService.showError("Could not get location. Please enable GPS.");
    }
  }



  startBreak() {
    this.featuresService.startBreak().subscribe({
      next: (response) => {
        this.snackbarService.showSuccess(response.message);
      },
      error: (error) => {
        this.snackbarService.showError(error.message || "Start break failed.");
      }
    });
  }

  endBreak() {
    this.featuresService.endBreak().subscribe({
      next: (response) => {
        this.snackbarService.showSuccess(response.message);
        console.log(response);
      },
      error: (error) => {
        this.snackbarService.showError(error.message || "End break failed.");
      }
    });
  }

  clockOut() {
    this.featuresService.clockOut().subscribe({
      next: (response) => {
        this.snackbarService.showSuccess(response.message);
        console.log(response);
      },
      error: (error) => {
        this.snackbarService.showError(error.message || "Clock-out failed.");
      }
    });
  }
}
