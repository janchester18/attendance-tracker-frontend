import { LoaderService } from './../../../loader.service';
import { FeaturesService } from '../../features.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CustomPaginatorComponent } from '../../../shared/custom-paginator/custom-paginator.component';
import { LoaderComponent } from "../../../shared/loader/loader.component";

interface AttendanceRecord {
  Date: string;
  ClockIn: string;
  ClockOut?: string | null;
  FormattedWorkDuration: string;
  FormattedBreakDuration: string;
  FormattedLateDuration: string;
  FormattedNightDifDuration: string;
  Status: string;
}

interface AttendanceTableData {
  date: Date;
  clockIn: Date;
  clockOut: Date | null;
  formattedWorkDuration: string;
  formattedBreakDuration: string;
  formattedLateDuration: string;
  formattedNightDifDuration: string;
  status: string;
}

@Component({
  selector: 'app-attendance-history',
  standalone: true, // Add this line
  templateUrl: './attendance-history.component.html',
  imports: [CommonModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatSort,
    MatPaginatorModule,
    CustomPaginatorComponent, LoaderComponent],
  styleUrls: ['./attendance-history.component.css']
})
export class AttendanceHistoryComponent implements OnInit{
  displayedColumns: string[] = [
    'date', 'clockIn', 'clockOut',
    'workDuration', 'breakDuration', 'lateDuration',
    'nightDifferential', 'status'
  ];

  attendanceRecords = new MatTableDataSource<AttendanceTableData>([]);

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.attendanceRecords.sort = sort;
  }

  constructor(private featuresServices: FeaturesService, private loaderService: LoaderService) {} // Inject Service

  totalRecords: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;

  ngOnInit() {
    this.loadAttendanceHistory();
  }

  loadAttendanceHistory(page: number = 1, size: number = 10) {
    this.loaderService.show();
    this.featuresServices.getSelfAttendanceHistory(page, size).subscribe({
      next: (response: any) => {
        console.log('📦 API Response:', response);

        this.attendanceRecords.data = response.data?.attendances?.map((record: any) => ({
          ...record,
          date: new Date(record.date).toLocaleDateString('en-CA'), // Convert to YYYY-MM-DD format
          userName: record.user?.name || 'N/A'
        })) || [];      this.totalRecords = response.data?.totalRecords || this.attendanceRecords.data.length;
        this.currentPage = page;
        this.pageSize = size;
      },
      error: err => console.error('❌ Error fetching attendance:', err)
    });
  }

  // Handle Page Change
  onPageChange(newPage: number) {
    console.log('📢 Changing to Page:', newPage);
    this.loadAttendanceHistory(newPage, this.pageSize);
  }

  // Handle Page Size Change
  onPageSizeChange(newSize: number) {
    console.log('🔄 Changing Page Size:', newSize);
    this.pageSize = newSize;
    this.currentPage = 1; // Reset to first page
    this.loadAttendanceHistory(1, newSize);
  }
}
