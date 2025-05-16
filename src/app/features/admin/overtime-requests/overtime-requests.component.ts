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
import { LoaderService } from '../../../loader.service';
import { LoaderComponent } from "../../../shared/loader/loader.component";

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
  selector: 'app-overtime-requests',
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    CustomPaginatorComponent,
    ViewOvertimeRequestComponent,
    EditOvertimeRequestComponent,
    MatTooltipModule,
    ApproveOvertimeConfirmationComponent,
    RejectOvertimeComponent,
    LoaderComponent
],
  templateUrl: './overtime-requests.component.html',
  styleUrl: './overtime-requests.component.css'
})
export class OvertimeRequestsComponent implements OnInit {
    isApproveOvertimeModalOpen = false;
    isViewOvertimeModalOpen = false;
    isEditOvertimeModalOpen = false;
    isRejectOvertimeModalOpen = false;
    selectedOvertime: OvertimeRecord | null = null;

    displayedColumns: string[] = [
      'employeeName',
      'date',
      'startTime',
      'endTime',
      'reason',
      'expectedOutput',
      'status',
      'actions',
    ];

    overtimeRecords = new MatTableDataSource<OvertimeRecord>([]);

    @ViewChild(MatSort, { static: false }) sort!: MatSort;
    @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

    totalRecords = 0;
    pageSize = 10;
    currentPage = 1;

    constructor(private featureService: FeaturesService, private loaderService: LoaderService) {}

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
      this.featureService.getAllOvertimeRequests(this.currentPage, this.pageSize).subscribe(response => {
        this.loaderService.show();

        if (response.status === 'SUCCESS') {
          this.overtimeRecords.data = response.data.overtimes.map((record: OvertimeRecord) => ({
            ...record,
            date: new Date(record.date).toLocaleDateString('en-CA'),
            startTime24: record.startTime,
            endTime24: record.endTime,
            startTime: this.formatTime(record.startTime),
            endTime: this.formatTime(record.endTime),
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
      this.loadOvertimeRequests();
    }

    onPageSizeChange(newSize: number): void {
      this.pageSize = newSize;
      this.currentPage = 1;
      this.loadOvertimeRequests();
    }

    viewDetails(record: OvertimeRecord) {
      this.selectedOvertime = record;
      this.isViewOvertimeModalOpen = true;
      setTimeout(() => {
        document.querySelector('.view-modal')?.classList.add('show');
        document.querySelector('.modal-overlay')?.classList.add('show');
      }, 10);
    }

    closeDetailsModal() {
      document.querySelector('.view-modal')?.classList.add('hide');
      document.querySelector('.modal-overlay')?.classList.add('hide');

      setTimeout(() => {
        this.selectedOvertime = null;
        this.isViewOvertimeModalOpen = false;
      }, 100);
    }

    editRecord(overtime: OvertimeRecord) {
      this.selectedOvertime = { ...overtime };
      this.isEditOvertimeModalOpen = true;
      setTimeout(() => {
        document.querySelector('.custom-modal')?.classList.add('show');
        document.querySelector('.modal-overlay')?.classList.add('show');
      }, 10);    }

    closeEditModal() {
      document.querySelector('.custom-modal')?.classList.add('hide');
      document.querySelector('.modal-overlay')?.classList.add('hide');

      setTimeout(() => {
        this.selectedOvertime = null; // Reset data when closing
        this.isEditOvertimeModalOpen = false; // Hide modal after animation
      }, 100);
    }

    approveOvertimeConfirmation(overtimeData: OvertimeRecord) {
      this.selectedOvertime = overtimeData;
      console.log(this.selectedOvertime)
      this.isApproveOvertimeModalOpen = true;
      setTimeout(() => {
        document.querySelector('.custom-modal')?.classList.add('show');
        document.querySelector('.modal-overlay')?.classList.add('show');
      }, 10);
    }

    closeModal() {
      document.querySelector('.custom-modal')?.classList.add('hide');
      document.querySelector('.modal-overlay')?.classList.add('hide');

      setTimeout(() => {
        this.isApproveOvertimeModalOpen = false; // Hide modal after animation
      }, 100);
    }

    rejectOvertimeConfirmation(overtimeData: OvertimeRecord) {
      this.selectedOvertime = overtimeData;
      console.log(this.selectedOvertime)
      this.isRejectOvertimeModalOpen = true;
      setTimeout(() => {
        document.querySelector('.custom-modal')?.classList.add('show');
        document.querySelector('.modal-overlay')?.classList.add('show');
      }, 10);
    }

    closeRejectModal() {
      document.querySelector('.custom-modal')?.classList.add('hide');
      document.querySelector('.modal-overlay')?.classList.add('hide');

      setTimeout(() => {
        this.selectedOvertime = null; // Reset data when closing
        this.isRejectOvertimeModalOpen = false;
      }, 100);
    }

    handleSubmission(data: any) {
      console.log('Overtime Request Submitted:', data);
      this.closeModal();
    }
}
