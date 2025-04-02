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
import { PrintSummaryComponent } from "../../../modals/admin/print-summary/print-summary.component";
import { LoaderComponent } from "../../../shared/loader/loader.component";
import { LoaderService } from '../../../loader.service';
import { PrintEmpSummaryComponent } from "../../../modals/admin/print-emp-summary/print-emp-summary.component";

interface AttendanceSummary {
  userId: number;
  employeeName: string;
  daysPresent: number;
  daysAbsent: number;
  daysOnLeave: number;
  lateArrivals: LateArrival[];
  earlyDepartures: number;
  totalWorkHours: string;
  overtimeEntries: OvertimeEntry[];
  rawLateCount: number;
  rawLateTime: string;
  otHours: string;
  finalOTHours: string;
  nightDiffHours: string;
  finalLates: number;
  finalLateTime: string;
  mpLsConverted: number;
  mpLsConvertedHours: string;
  startDate: string;
  endDate: string;
}

interface LateArrival {
  clockIn: string;
  lateDuration: string;
  isOffseted: boolean;
}

interface OvertimeEntry {
  date: string;
  overtimeDuration: string;
  reason: string | null;
}

@Component({
  selector: 'app-reports',
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    CustomPaginatorComponent,
    MatTooltipModule,
    RejectLeaveComponent,
    PrintSummaryComponent,
    LoaderComponent,
    PrintEmpSummaryComponent
],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent implements OnInit {
  // Add a new flag for the print-all modal
    isPrintAllSummariesModalOpen = false;
    isPrintSummaryModalOpen = false;
    isPrintEmpSummaryModalOpen = false;
    selectedSummary: AttendanceSummary | null = null;

    displayedColumns: string[] = [
      'employeeName',
      'daysPresent',
      'daysAbsent',
      'daysOnLeave',
      'lateArrivals',
      'earlyDepartures',
      'totalWorkHours',
      'otHours',
      'nightDiffHours',
      'actions',
    ];

    attendanceSummary = new MatTableDataSource<AttendanceSummary>([]);

    @ViewChild(MatSort, { static: false }) sort!: MatSort;
    @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

    totalRecords = 0;
    pageSize = 10;
    currentPage = 1;

    formatDate(date: Date): string {
      return date.toISOString().split('T')[0]; // Extract only YYYY-MM-DD
    }

    startDate = this.formatDate(new Date("2025-03-16T08:00:00Z"));
    endDate = this.formatDate(new Date("2025-04-15T08:00:00Z"));


    constructor(private featureService: FeaturesService, private loaderService: LoaderService) {}

    ngOnInit(): void {
      this.loadAttendanceSummary();
      console.log(this.startDate);
      console.log(this.endDate);
    }

    ngAfterViewInit() {
      setTimeout(() => {
        this.attendanceSummary.sort = this.sort;
        this.attendanceSummary.paginator = this.paginator;
      });
    }

    loadAttendanceSummary(): void {
      this.loaderService.show();
      this.featureService.getAttendanceSummary(this.currentPage, this.pageSize, this.startDate, this.endDate)
        .subscribe(response => {
          if (response?.status === 'SUCCESS' && response.data?.attendanceSummary) {
            this.attendanceSummary.data = response.data.attendanceSummary.map((record: AttendanceSummary) => ({
              ...record
            }));
            this.totalRecords = response.data.totalRecords ?? 0;
            this.pageSize = response.data.pageSize ?? this.pageSize;
            this.currentPage = response.data.currentPage ?? 1;
          } else {
            console.error('Unexpected API response:', response);
            this.attendanceSummary.data = []; // Set empty array to prevent UI crashes
          }
        }, error => {
          console.error('API call failed:', error);
          this.attendanceSummary.data = [];
        });
    }



    onPageChange(newPage: number): void {
      this.currentPage = newPage;
      this.loadAttendanceSummary();
    }

    onPageSizeChange(newSize: number): void {
      this.pageSize = newSize;
      this.currentPage = 1;
      this.loadAttendanceSummary();
    }

    printSummary(record: AttendanceSummary) {
      this.selectedSummary = record;
      this.isPrintSummaryModalOpen = true;
      console.log('Printing Summary:', this.selectedSummary);
      // Wait 10ms to add the "show" classes (to allow Angular to update the DOM)
      setTimeout(() => {
        document.querySelector('.custom-modal')?.classList.add('show');
        document.querySelector('.modal-overlay')?.classList.add('show');
      }, 10);
    }

    closePrintSummaryModal() {
     // Remove "show" classes to trigger your hide animation
      document.querySelector('.custom-modal')?.classList.add('hide');
      document.querySelector('.modal-overlay')?.classList.add('hide');

      // Wait 100ms for the animation to complete before resetting the state
      setTimeout(() => {
        this.selectedSummary = null;
        this.isPrintSummaryModalOpen = false;
      }, 100);
    }

    openPrintAllSummaries() {
      this.isPrintAllSummariesModalOpen = true;
      console.log('Printing Summary:', this.selectedSummary);
      // Wait 10ms to add the "show" classes (to allow Angular to update the DOM)
      setTimeout(() => {
        document.querySelector('.custom-modal')?.classList.add('show');
        document.querySelector('.modal-overlay')?.classList.add('show');
      }, 10);
    }

    closePrintAllSummaries() {
     // Remove "show" classes to trigger your hide animation
      document.querySelector('.custom-modal')?.classList.add('hide');
      document.querySelector('.modal-overlay')?.classList.add('hide');

      // Wait 100ms for the animation to complete before resetting the state
      setTimeout(() => {
        this.isPrintAllSummariesModalOpen = false;
      }, 100);
    }

    printEmpSum(attendanceSummary: AttendanceSummary) {
      this.selectedSummary = { ...attendanceSummary };
      this.isPrintEmpSummaryModalOpen = true;
      setTimeout(() => {
        document.querySelector('.custom-modal')?.classList.add('show');
        document.querySelector('.modal-overlay')?.classList.add('show');
      }, 10);    }

    closeEmpSumModal() {
      document.querySelector('.custom-modal')?.classList.add('hide');
      document.querySelector('.modal-overlay')?.classList.add('hide');

      setTimeout(() => {
        this.selectedSummary = null; // Reset data when closing
        this.isPrintEmpSummaryModalOpen = false; // Hide modal after animation
      }, 100);
    }



    // handleSubmission(data: any) {
    //   console.log('Overtime Request Submitted:', data);
    //   this.closeModal();
    // }
}
