import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { FeaturesService } from '../../../features/features.service';

@Component({
  selector: 'app-approve-leave',
  imports: [CommonModule],
  templateUrl: './approve-leave.component.html',
  styleUrl: './approve-leave.component.css'
})
export class ApproveLeaveComponent {
  @Input() leaveRequestData: any | null = null; // Receive overtime request details
  @Output() close = new EventEmitter<void>(); // Emits event to close modal
  @Output() refreshTable = new EventEmitter<void>(); // Emits event to refresh the table after action

  constructor(
    private featuresService: FeaturesService,
    private snackbarService: SnackbarService
  ) {}

  approveRequest() {
    if (!this.leaveRequestData || !this.leaveRequestData.id) {
      this.snackbarService.showError("Error: No overtime request selected.");
      return;
    }

    const id = this.leaveRequestData.id;

    this.featuresService.approveLeave(id).subscribe({
      next: (response) => {
        this.snackbarService.showSuccess("Leave request approved!");
        this.refreshTable.emit();
        this.close.emit();
      },
      error: (error) => {
        this.snackbarService.showError("Error approving leave.");
      }
    });
  }

  closeModal() {
    this.close.emit(); // Close the modal
  }
}
