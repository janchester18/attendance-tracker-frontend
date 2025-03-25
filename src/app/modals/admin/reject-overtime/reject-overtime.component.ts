import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { FeaturesService } from '../../../features/features.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-reject-overtime',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reject-overtime.component.html',
  styleUrl: './reject-overtime.component.css'
})
export class RejectOvertimeComponent {
  @Input() overtimeRequestData: any = {};
  @Output() close = new EventEmitter<void>(); // Emits event to close modal
  @Output() refreshTable = new EventEmitter<void>(); // Emits event to refresh the table after action

  rejectionReason: string = "";

  validationMessage: string = '';

  rejectForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private featuresService: FeaturesService,
    private snackbarService: SnackbarService
  ) {
    this.rejectForm = this.fb.group({
          rejectionReason: ['', Validators.required],
        });

        // 🔥 Automatically check for changes and clear the message
        this.rejectForm.valueChanges.subscribe(() => {
          if (this.rejectForm.valid) {
            this.validationMessage = '';
          }
        });
  }

  rejectRequest() {
    if (!this.rejectForm.value.rejectionReason.trim()) {
      this.validationMessage = "Rejection reason is required.";
      return;
    }

    this.featuresService.rejectOvertime(this.overtimeRequestData.id, this.rejectForm.value.rejectionReason)
    .subscribe(response => {
        this.snackbarService.showSuccess("Overtime request rejected!");
        this.refreshTable.emit();
        this.close.emit();
      }, error => {
        this.snackbarService.showError("Error approving overtime.");
      });
  }

  closeModal() {
    this.close.emit(); // Close the modal
  }

  isInvalid(field: string): boolean {
    return this.rejectForm.controls[field].touched && this.rejectForm.controls[field].invalid;
  }

}
