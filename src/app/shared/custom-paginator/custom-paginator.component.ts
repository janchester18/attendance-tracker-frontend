import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-custom-paginator',
  imports: [MatFormFieldModule, MatSelectModule, MatButtonModule],
  templateUrl: './custom-paginator.component.html',
  styleUrls: ['./custom-paginator.component.css']
})
export class CustomPaginatorComponent {
  @Input() totalRecords: number = 0; // Total records from API
  @Input() pageSize: number = 10;    // Number of items per page
  @Input() currentPage: number = 1;  // Current page index
  @Output() pageChange = new EventEmitter<number>(); // Emit new page index
  @Output() pageSizeChange = new EventEmitter<number>(); // Emit new page size

  // Compute total pages
  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }

  // Go to previous page
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.pageChange.emit(this.currentPage);
    }
  }

  // Go to next page
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.pageChange.emit(this.currentPage);
    }
  }

  // Change page size
  updatePageSize(event: any) {
    const newSize = Number(event.target.value);
    this.pageSizeChange.emit(newSize);
  }
}
