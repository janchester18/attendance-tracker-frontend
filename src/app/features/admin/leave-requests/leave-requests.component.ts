import { Component, OnInit, ViewChild } from '@angular/core';
import { FeaturesService } from '../../features.service';
import { CustomPaginatorComponent } from '../../../shared/custom-paginator/custom-paginator.component';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AddOvertimeRequestComponent } from '../../../modals/employee/add-overtime-request/add-overtime-request.component';
import { ViewOvertimeRequestComponent } from '../../../modals/employee/view-overtime-request/view-overtime-request.component';
import { EditOvertimeRequestComponent } from '../../../modals/employee/edit-overtime-request/edit-overtime-request.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ApproveOvertimeConfirmationComponent } from "../../../modals/admin/approve-overtime-confirmation/approve-overtime-confirmation.component";
import { RejectOvertimeComponent } from "../../../modals/admin/reject-overtime/reject-overtime.component";
import { ApproveLeaveComponent } from "../../../modals/admin/approve-leave/approve-leave.component";
import { RejectLeaveComponent } from "../../../modals/admin/reject-leave/reject-leave.component";
import { ViewLeaveRequestComponent } from "../../../modals/employee/view-leave-request/view-leave-request.component";
import { ViewLeaveComponent } from "../../../modals/admin/view-leave/view-leave.component";

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
  selector: 'app-leave-requests',
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    CustomPaginatorComponent,
    EditOvertimeRequestComponent,
    MatTooltipModule,
    ApproveLeaveComponent,
    RejectLeaveComponent,
    ViewLeaveComponent
],
  templateUrl: './leave-requests.component.html',
  styleUrl: './leave-requests.component.css'
})
export class LeaveRequestsComponent implements OnInit {
isApproveLeaveModalOpen = false;
    isViewLeaveModalOpen = false;
    isEditLeaveModalOpen = false;
    isRejectLeaveModalOpen = false;
    selectedLeave: LeaveRecord | null = null;

    displayedColumns: string[] = [
      'employeeName',
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
      this.featureService.getAllLeaveRequests(this.currentPage, this.pageSize).subscribe(response => {
        if (response.status === 'SUCCESS') {
          this.leaveRecords.data = response.data.leaves.map((record: LeaveRecord) => ({
            ...record,
            startDate: new Date(record.startDate).toLocaleDateString('en-CA'),
            endDate: new Date(record.endDate).toLocaleDateString('en-CA'),

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
      const formattedHour = hour % 12 || 12;
      return `${formattedHour}:${minute.toString().padStart(2, '0')} ${period}`;
    }

    onPageChange(newPage: number): void {
      this.currentPage = newPage;
      this.loadLeaveRequests();
    }

    onPageSizeChange(newSize: number): void {
      this.pageSize = newSize;
      this.currentPage = 1;
      this.loadLeaveRequests();
    }

    viewDetails(record: LeaveRecord) {
      this.selectedLeave = record;
      this.isViewLeaveModalOpen = true;
      setTimeout(() => {
        document.querySelector('.view-modal')?.classList.add('show');
        document.querySelector('.modal-overlay')?.classList.add('show');
      }, 10);
    }

    closeDetailsModal() {
      document.querySelector('.view-modal')?.classList.add('hide');
      document.querySelector('.modal-overlay')?.classList.add('hide');

      setTimeout(() => {
        this.selectedLeave = null;
        this.isViewLeaveModalOpen = false;
      }, 100);
    }

    editRecord(leave: LeaveRecord) {
      this.selectedLeave = { ...leave };
      this.isEditLeaveModalOpen = true;
      setTimeout(() => {
        document.querySelector('.custom-modal')?.classList.add('show');
        document.querySelector('.modal-overlay')?.classList.add('show');
      }, 10);    }

    closeEditModal() {
      document.querySelector('.custom-modal')?.classList.add('hide');
      document.querySelector('.modal-overlay')?.classList.add('hide');

      setTimeout(() => {
        this.selectedLeave = null; // Reset data when closing
        this.isEditLeaveModalOpen = false; // Hide modal after animation
      }, 100);
    }

    approveOvertimeConfirmation(leaveData: LeaveRecord) {
      this.selectedLeave = leaveData;
      console.log(this.selectedLeave)
      this.isApproveLeaveModalOpen = true;
      setTimeout(() => {
        document.querySelector('.custom-modal')?.classList.add('show');
        document.querySelector('.modal-overlay')?.classList.add('show');
      }, 10);
    }

    closeModal() {
      document.querySelector('.custom-modal')?.classList.add('hide');
      document.querySelector('.modal-overlay')?.classList.add('hide');

      setTimeout(() => {
        this.isApproveLeaveModalOpen = false; // Hide modal after animation
      }, 100);
    }

    rejectOvertimeConfirmation(leaveData: LeaveRecord) {
      this.selectedLeave = leaveData;
      console.log(this.selectedLeave)
      this.isRejectLeaveModalOpen = true;
      setTimeout(() => {
        document.querySelector('.custom-modal')?.classList.add('show');
        document.querySelector('.modal-overlay')?.classList.add('show');
      }, 10);
    }

    closeRejectModal() {
      document.querySelector('.custom-modal')?.classList.add('hide');
      document.querySelector('.modal-overlay')?.classList.add('hide');

      setTimeout(() => {
        this.selectedLeave = null; // Reset data when closing
        this.isRejectLeaveModalOpen = false;
      }, 100);
    }

    handleSubmission(data: any) {
      console.log('Overtime Request Submitted:', data);
      this.closeModal();
    }
}
