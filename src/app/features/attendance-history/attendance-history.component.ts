import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-attendance-history',
  templateUrl: './attendance-history.component.html',
  imports: [    CommonModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatSort
    ],
  styleUrls: ['./attendance-history.component.css']
})
export class AttendanceHistoryComponent {
  displayedColumns: string[] = [
    'id', 'userName', 'date', 'clockIn', 'clockOut',
    'workDuration', 'breakDuration', 'lateDuration',
    'nightDifferential', 'status'
  ];

  attendanceRecords = new MatTableDataSource([
    {
      id: 1,
      userName: "John Doe",
      date: new Date(),
      clockIn: new Date("2024-03-14T09:00:00"),
      clockOut: new Date("2024-03-14T18:00:00"),
      formattedWorkDuration: "8h 30m",
      formattedBreakDuration: "1h",
      formattedLateDuration: "0m",
      formattedNightDifDuration: "0h",
      status: "Present"
    },
    {
      id: 2,
      userName: "Jane Smith",
      date: new Date(),
      clockIn: new Date("2024-03-14T10:30:00"),
      clockOut: new Date("2024-03-14T18:00:00"),
      formattedWorkDuration: "6h 30m",
      formattedBreakDuration: "1h",
      formattedLateDuration: "1h 30m",
      formattedNightDifDuration: "0h",
      status: "Late"
    }
  ]);

  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.attendanceRecords.sort = sort;
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'Present': return 'status-present';
      case 'Absent': return 'status-absent';
      case 'Late': return 'status-late';
      case 'On Leave': return 'status-leave';
      default: return '';
    }
  }
}
