import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { FeaturesService } from '../../../features/features.service';

@Component({
  selector: 'app-approve-overtime-confirmation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './approve-overtime-confirmation.component.html',
  styleUrl: './approve-overtime-confirmation.component.css'
})
export class ApproveOvertimeConfirmationComponent {
  @Input() overtimeRequestData: any | null = null; // Receive overtime request details
  @Output() close = new EventEmitter<void>(); // Emits event to close modal
  @Output() refreshTable = new EventEmitter<void>(); // Emits event to refresh the table after action

  constructor(
    private featuresService: FeaturesService,
    private snackbarService: SnackbarService
  ) {}

  approveRequest() {
    if (!this.overtimeRequestData || !this.overtimeRequestData.id) {
      this.snackbarService.showError("Error: No overtime request selected.");
      return;
    }

    const id = this.overtimeRequestData.id;

    this.featuresService.approveOvertime(id).subscribe({
      next: (response) => {
        this.snackbarService.showSuccess("Overtime request approved!");
        this.refreshTable.emit();
        this.close.emit();
      },
      error: (error) => {
        this.snackbarService.showError("Error approving overtime.");
      }
    });
  }

  closeModal() {
    this.close.emit(); // Close the modal
  }
}
