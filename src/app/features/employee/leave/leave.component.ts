import { Component, OnInit, ViewChild } from '@angular/core';
import { FeaturesService } from '../../features.service';
import { CustomPaginatorComponent } from '../../../shared/custom-paginator/custom-paginator.component';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import {MatTooltipModule} from '@angular/material/tooltip';
import { AddLeaveRequestComponent } from '../../../modals/employee/add-leave-request/add-leave-request.component';
import { ViewLeaveRequestComponent } from '../../../modals/employee/view-leave-request/view-leave-request.component';
import { EditLeaveRequestComponent } from '../../../modals/employee/edit-leave-request/edit-leave-request.component';

interface LeaveRecord {
  id: number;
  userId: number;
  userName: string;
  startDate: string;
  endDate: string;
  daysCount: number;
  statusName: string;
  type: number;
  typeName: string;
  reason: string;
  reviewedBy: number | null;
  approverName: string | null;
  rejectionReason: string | null;
  createdDate: string;
}

@Component({
  selector: 'app-leave',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    CustomPaginatorComponent,
    AddLeaveRequestComponent,
    ViewLeaveRequestComponent,
    EditLeaveRequestComponent,
    MatTooltipModule
  ],
  templateUrl: './leave.component.html',
  styleUrl: './leave.component.css'
})
export class LeaveComponent {
  isAddLeaveModalOpen = false;
  isViewLeaveModalOpen = false; // Controls modal visibility
  isEditLeaveModalOpen = false; // Controls modal visibility
  selectedLeave: any = null; // Stores the overtime request to view

  displayedColumns: string[] = [
    'startDate',
    'endDate',
    'daysCount',
    'typeName',
    'reason',
    'statusName',
    'actions',
  ];

  leaveRecords = new MatTableDataSource<LeaveRecord>([]);

  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  totalRecords = 0;
  pageSize = 10;
  currentPage = 1;

  constructor(private featureService: FeaturesService) {}

  ngOnInit(): void {
    this.loadLeaveRequests();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.leaveRecords.sort = this.sort;
      this.leaveRecords.paginator = this.paginator;
    });
  }

  loadLeaveRequests(): void {
    this.featureService.getSelfLeaveRequests(this.currentPage, this.pageSize).subscribe(response => {
      if (response.status === 'SUCCESS') {
        this.leaveRecords.data = response.data.leave.map((record: LeaveRecord) => ({
          ...record,
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
    this.loadLeaveRequests();
  }

  onPageSizeChange(newSize: number): void {
    console.log('🔄 Changing Page Size:', newSize);
    this.pageSize = newSize;
    this.currentPage = 1; // Reset to first page
    this.loadLeaveRequests();
  }

  // Function to handle viewing details
  viewDetails(record: any) {
    this.isViewLeaveModalOpen = true; // Open the modal
    this.selectedLeave = record; // Store selected overtime request
    console.log(this.selectedLeave);
    setTimeout(() => {
      document.querySelector('.view-modal')?.classList.add('show');
      document.querySelector('.modal-overlay')?.classList.add('show');
    }, 10);
  }

  closeDetailsModal() {
    document.querySelector('.view-modal')?.classList.add('hide');
    document.querySelector('.modal-overlay')?.classList.add('hide');

    setTimeout(() => {
      this.selectedLeave = null; // Reset data when closing
      this.isViewLeaveModalOpen = false; // Hide modal after animation
    }, 100);
  }

  // Function to handle viewing details
  editRecord(leave: any) {
    this.isEditLeaveModalOpen = true; // Open the modal
    this.selectedLeave = {
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
      this.selectedLeave = null; // Reset data when closing
      this.isEditLeaveModalOpen = false; // Hide modal after animation
    }, 100);
  }

  AddLeaveModal() {
    this.isAddLeaveModalOpen = true;
    setTimeout(() => {
      document.querySelector('.custom-modal')?.classList.add('show');
      document.querySelector('.modal-overlay')?.classList.add('show');
    }, 10);
  }

  closeModal() {
    document.querySelector('.custom-modal')?.classList.add('hide');
    document.querySelector('.modal-overlay')?.classList.add('hide');

    setTimeout(() => {
      this.isAddLeaveModalOpen = false; // Hide modal after animation
    }, 100);
  }

  handleSubmission(data: any) {
    console.log('Overtime Request Submitted:', data);
    this.closeModal();
  }

}
