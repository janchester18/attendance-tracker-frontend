import { Component, ViewChild } from '@angular/core';
import { CustomPaginatorComponent } from "../../../shared/custom-paginator/custom-paginator.component";
import { MatPaginator } from '@angular/material/paginator';
import { FeaturesService } from '../../features.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { AddEmployeeComponent } from "../../../modals/admin/add-employee/add-employee.component";
import { LoaderComponent } from "../../../shared/loader/loader.component";
import { LoaderService } from '../../../loader.service';

@Component({
  selector: 'app-user-management',
  imports: [CustomPaginatorComponent, CommonModule, MatButtonModule, MatIconModule, AddEmployeeComponent, LoaderComponent],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent {
  isAddEmployeeModalOpen = false;

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  users: any[] = [];
  totalRecords = 0;
  pageSize = 30;
  currentPage = 1;

  constructor(private featureService: FeaturesService, private loaderService: LoaderService ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.featureService.getAllUsers(this.currentPage, this.pageSize).subscribe(response => {
      this.loaderService.show();
      if (response.status === 'SUCCESS') {
        this.users = response.data.users.map((user: any) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          accumulatedOvertime: user.accumulatedOvertime
        }));
        this.totalRecords = response.data.totalRecords;
        this.pageSize = response.data.pageSize;
        this.currentPage = response.data.currentPage;
      }
    });
  }

  AddEmployeeModal() {
    this.isAddEmployeeModalOpen = true;
    setTimeout(() => {
      document.querySelector('.custom-modal')?.classList.add('show');
      document.querySelector('.modal-overlay')?.classList.add('show');
    }, 10);
  }

  closeAddEmployeeModal() {
    document.querySelector('.custom-modal')?.classList.add('hide');
    document.querySelector('.modal-overlay')?.classList.add('hide');

    setTimeout(() => {
      this.isAddEmployeeModalOpen = false; // Hide modal after animation
    }, 100);
  }

  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.loadUsers();
  }

  onPageSizeChange(newSize: number): void {
    this.pageSize = newSize;
    this.currentPage = 1;
    this.loadUsers();
  }

  handleSubmission(data: any) {
    console.log('Overtime Request Submitted:', data);
    this.closeAddEmployeeModal();
  }
}
