import { FeaturesService } from './../features.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

interface AttendanceRecord {
  User: { FullName?: string; Name: string };
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
  userName: string;
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
  imports: [    CommonModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatSort,
    MatPaginatorModule,
    ],
  styleUrls: ['./attendance-history.component.css']
})
export class AttendanceHistoryComponent implements OnInit{
  displayedColumns: string[] = [
    'userName', 'date', 'clockIn', 'clockOut',
    'workDuration', 'breakDuration', 'lateDuration',
    'nightDifferential', 'status'
  ];
  paginator: MatPaginator | undefined;

  attendanceRecords = new MatTableDataSource<AttendanceTableData>([]);

  @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator) {
    this.paginator = paginator;
    this.attendanceRecords.paginator = this.paginator;
  }
  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.attendanceRecords.sort = sort;
  }

  constructor(private featuresServices: FeaturesService) {} // Inject Service

  ngOnInit(): void {
    this.loadAttendanceHistory();
  }

  loadAttendanceHistory(page: number = 1, pageSize: number = 10): void {
    this.featuresServices.getSelfAttendanceHistory(page, pageSize).subscribe({
      next: (response: any) => {
        const attendanceData = response.data?.attendance || [];

        if (Array.isArray(attendanceData)) {
          this.attendanceRecords.data = attendanceData.map((record) => ({
            userName: record?.user?.FullName || record?.user?.name || 'Unknown',
            date: new Date(record?.date),
            clockIn: new Date(record?.clockIn),
            clockOut: record?.clockOut ? new Date(record?.clockOut) : null,
            formattedWorkDuration: record?.formattedWorkDuration || '-',
            formattedBreakDuration: record?.formattedBreakDuration || '-',
            formattedLateDuration: record?.formattedLateDuration || '-',
            formattedNightDifDuration: record?.formattedNightDifDuration || '-',
            status: record?.status || 'Unknown'
          }));

          // Set paginator length
          if (this.paginator) {
            this.paginator.length = response.data?.totalRecords || attendanceData.length;
          }
        } else {
          console.error('Error: API attendance data is not an array', response.data);
        }
      },
      error: (err) => console.error('Error fetching attendance:', err)
    });
  }

  // Trigger pagination event
  onPageChange(event: any) {
    console.log('Page changed:', event);
    this.loadAttendanceHistory(event.pageIndex + 1, event.pageSize);
  }
}


