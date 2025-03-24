import { FeaturesService } from '../../features.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CustomPaginatorComponent } from '../../../shared/custom-paginator/custom-paginator.component';
import { MatTooltip } from '@angular/material/tooltip';
import { ViewAttendanceDetailsComponent } from '../../../modals/admin/view-attendance-details/view-attendance-details.component';
import { EditAttendanceComponent } from '../../../modals/admin/edit-attendance/edit-attendance.component';

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
  name: string;
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
  selector: 'app-attendance-records',
  imports: [CommonModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatSort,
    MatPaginatorModule,
    CustomPaginatorComponent,
    MatTooltip,
    ViewAttendanceDetailsComponent,
    EditAttendanceComponent],
  templateUrl: './attendance-records.component.html',
  styleUrl: './attendance-records.component.css'
})
export class AttendanceRecordsComponent {
  isViewAttendanceModalOpen = false; // Controls modal visibility
  isEditAttendanceModalOpen = false; // Controls modal visibility
  selectedAttendance: any = null; // Stores the overtime request to view

displayedColumns: string[] = [
    'name', 'date', 'clockIn', 'clockOut',
    'workDuration',  'status', 'actions'
  ];

  attendanceRecords = new MatTableDataSource<AttendanceTableData>([]);

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.attendanceRecords.sort = sort;
  }

  constructor(private featuresServices: FeaturesService) {} // Inject Service

  totalRecords: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;

  ngOnInit() {
    this.loadAttendanceHistory();
  }

  loadAttendanceHistory(page: number = 1, size: number = 10) {
    this.featuresServices.getAllAttendanceHistory(page, size).subscribe({
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

  // Function to handle viewing details
  viewDetails(record: any) {
    this.isViewAttendanceModalOpen = true; // Open the modal
    this.selectedAttendance = record; // Store selected overtime request
    console.log(this.selectedAttendance);
    setTimeout(() => {
      document.querySelector('.view-modal')?.classList.add('show');
      document.querySelector('.modal-overlay')?.classList.add('show');
    }, 10);
  }

  closeDetailsModal() {
    document.querySelector('.view-modal')?.classList.add('hide');
    document.querySelector('.modal-overlay')?.classList.add('hide');

    setTimeout(() => {
      this.selectedAttendance = null; // Reset data when closing
      this.isViewAttendanceModalOpen = false; // Hide modal after animation
    }, 100);
  }

  // Function to handle viewing details
  editRecord(leave: any) {
    this.isEditAttendanceModalOpen = true; // Open the modal
    this.selectedAttendance = {
      ...leave,
      type: leave.type, // Pass 24-hour format
      startDate: new Date(leave.startDate).toLocaleDateString('en-CA'), // Convert to YYYY-MM-DD format
      endDate: new Date(leave.endDate).toLocaleDateString('en-CA'), // Convert to YYYY-MM-DD format
  };
  console.log(leave);
  setTimeout(() => {
      document.querySelector('.custom-modal')?.classList.add('show');
      document.querySelector('.modal-overlay')?.classList.add('show');
    }, 10);
  }

  closeEditModal() {
    document.querySelector('.custom-modal')?.classList.add('hide');
    document.querySelector('.modal-overlay')?.classList.add('hide');

    setTimeout(() => {
      this.selectedAttendance = null; // Reset data when closing
      this.isEditAttendanceModalOpen = false; // Hide modal after animation
    }, 100);
  }

  handleSubmission(data: any) {
    console.log('Overtime Request Submitted:', data);
    this.closeEditModal();
  }
}
