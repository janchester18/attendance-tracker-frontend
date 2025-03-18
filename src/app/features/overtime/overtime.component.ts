import { Component, OnInit, ViewChild } from '@angular/core';
import { FeaturesService } from '../features.service';
import { CustomPaginatorComponent } from '../../shared/custom-paginator/custom-paginator.component';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AddOvertimeRequestComponent } from '../../modals/add-overtime-request/add-overtime-request.component';
import { ViewOvertimeRequestComponent } from '../../modals/view-overtime-request/view-overtime-request.component';
import { EditOvertimeRequestComponent } from '../../modals/edit-overtime-request/edit-overtime-request.component';

interface OvertimeRecord {
  id: number;
  userId: number;
  employeeName: string;
  date: string;
  startTime: string;
  endTime: string;
  reason: string;
  expectedOutput: string;
  status: string;
  reviewedBy: number | null;
  approverName: string | null;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-overtime',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    CustomPaginatorComponent,
    AddOvertimeRequestComponent,
    ViewOvertimeRequestComponent,
    EditOvertimeRequestComponent
  ],
  templateUrl: './overtime.component.html',
  styleUrls: ['./overtime.component.css']
})
export class OvertimeComponent implements OnInit {
  isAddOvertimeModalOpen = false;
  isViewOvertimeModalOpen = false; // Controls modal visibility
  isEditOvertimeModalOpen = false; // Controls modal visibility
  selectedOvertime: any = null; // Stores the overtime request to view

  displayedColumns: string[] = [
    'date',
    'startTime',
    'endTime',
    'reason',
    'expectedOutput',
    'status',
    'approverName',
    'rejectionReason',
    'actions',
  ];

  overtimeRecords = new MatTableDataSource<OvertimeRecord>([]);

  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  totalRecords = 0;
  pageSize = 10;
  currentPage = 1;

  constructor(private featureService: FeaturesService) {}

  ngOnInit(): void {
    this.loadOvertimeRequests();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.overtimeRecords.sort = this.sort;
      this.overtimeRecords.paginator = this.paginator;
    });
  }

  loadOvertimeRequests(): void {
    this.featureService.getSelfOvertimeRequests(this.currentPage, this.pageSize).subscribe(response => {
      if (response.status === 'SUCCESS') {
        this.overtimeRecords.data = response.data.overtime.map((record: OvertimeRecord) => ({
          ...record,
          date: new Date(record.date).toISOString().split('T')[0], // Convert to YYYY-MM-DD format
          startTime24: record.startTime, // Keep original 24-hour format
          endTime24: record.endTime, // Keep original 24-hour format
          startTime: this.formatTime(record.startTime), // Convert to 12-hour for display
          endTime: this.formatTime(record.endTime), // Convert to 12-hour for display
        }));
        this.totalRecords = response.data.totalRecords;
        this.pageSize = response.data.pageSize;
        this.currentPage = response.data.currentPage;
      }
    });
  }


  formatTime(time: string): string {
    if (!time) return '';
    const [hour, minute] = time.split(':').map(Number);
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12; // Convert 0 to 12 for AM
    return `${formattedHour}:${minute.toString().padStart(2, '0')} ${period}`;
  }

  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.loadOvertimeRequests();
  }

  onPageSizeChange(newSize: number): void {
    console.log('🔄 Changing Page Size:', newSize);
    this.pageSize = newSize;
    this.currentPage = 1; // Reset to first page
    this.loadOvertimeRequests();
  }

  // Function to handle viewing details
  viewDetails(record: any) {
    this.isViewOvertimeModalOpen = true; // Open the modal
    this.selectedOvertime = record; // Store selected overtime request
    setTimeout(() => {
      document.querySelector('.view-modal')?.classList.add('show');
      document.querySelector('.modal-overlay')?.classList.add('show');
    }, 10);
  }

  closeDetailsModal() {
    document.querySelector('.view-modal')?.classList.add('hide');
    document.querySelector('.modal-overlay')?.classList.add('hide');

    setTimeout(() => {
      this.selectedOvertime = null; // Reset data when closing
      this.isViewOvertimeModalOpen = false; // Hide modal after animation
    }, 100);
  }

  // Function to handle viewing details
  editRecord(overtime: any) {
    this.isEditOvertimeModalOpen = true; // Open the modal
    this.selectedOvertime = {
      ...overtime,
      startTime: overtime.startTime24, // Pass 24-hour format
      endTime: overtime.endTime24, // Pass 24-hour format
  };    setTimeout(() => {
      document.querySelector('.custom-modal')?.classList.add('show');
      document.querySelector('.modal-overlay')?.classList.add('show');
    }, 10);
  }

  closeEditModal() {
    document.querySelector('.custom-modal')?.classList.add('hide');
    document.querySelector('.modal-overlay')?.classList.add('hide');

    setTimeout(() => {
      this.selectedOvertime = null; // Reset data when closing
      this.isEditOvertimeModalOpen = false; // Hide modal after animation
    }, 100);
  }

  AddOvertimeModal() {
    this.isAddOvertimeModalOpen = true;
    setTimeout(() => {
      document.querySelector('.custom-modal')?.classList.add('show');
      document.querySelector('.modal-overlay')?.classList.add('show');
    }, 10);
  }

  closeModal() {
    document.querySelector('.custom-modal')?.classList.add('hide');
    document.querySelector('.modal-overlay')?.classList.add('hide');

    setTimeout(() => {
      this.isAddOvertimeModalOpen = false; // Hide modal after animation
    }, 100);
  }

  handleSubmission(data: any) {
    console.log('Overtime Request Submitted:', data);
    this.closeModal();
  }

}
