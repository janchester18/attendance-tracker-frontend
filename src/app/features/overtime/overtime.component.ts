import { Component, OnInit, ViewChild } from '@angular/core';
import { FeaturesService } from '../features.service';
import { CustomPaginatorComponent } from '../../shared/custom-paginator/custom-paginator.component';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

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
    CustomPaginatorComponent
  ],
  templateUrl: './overtime.component.html',
  styleUrls: ['./overtime.component.css']
})
export class OvertimeComponent implements OnInit {
  displayedColumns: string[] = [
    'employeeName',
    'date',
    'startTime',
    'endTime',
    'reason',
    'expectedOutput',
    'status',
    'approverName',
    'rejectionReason'
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
          date: new Date(record.date).toISOString().split('T')[0] // Convert to YYYY-MM-DD format
        }));
        this.totalRecords = response.data.totalRecords;
        this.pageSize = response.data.pageSize;
        this.currentPage = response.data.currentPage;
      }
    });
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

  openOvertimeDialog() {
    console.log("Add Overtime Request button clicked.")
  }
}
