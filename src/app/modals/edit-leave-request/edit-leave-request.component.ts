import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { FeaturesService } from '../../features/features.service';
import { SnackbarComponent } from '../../shared/snackbar/snackbar.component';
import { SnackbarService } from '../../shared/snackbar/snackbar.service';

@Component({
  selector: 'app-edit-leave-request',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-leave-request.component.html',
  styleUrl: './edit-leave-request.component.css'
})
export class EditLeaveRequestComponent implements OnInit {
  @Input() leaveData: any | null = null; // 👈 Receive data from parent
  @Output() close = new EventEmitter<void>(); // Emits event to close modal
  @Output() submitRequest = new EventEmitter<any>(); // Emits event with form data
  @Output() refreshTable = new EventEmitter<void>(); // Emits event to refresh table

  // Hardcoded Leave Types
  leaveTypes = [
    { id: 1, name: 'Vacation' },
    { id: 2, name: 'Sick Leave' },
    { id: 3, name: 'Personal Leave' },
    { id: 4, name: 'Bereavement' },
    { id: 5, name: 'Maternity' },
    { id: 6, name: 'Paternity' }
  ];

  ngOnInit(): void {
    if (this.leaveData) {
      this.leaveForm.patchValue({
        startDate: this.leaveData.startDate,
        endDate: this.leaveData.endDate,
        reason: this.leaveData.reason,
        type: this.leaveData.type || '', // Ensure it's the ID
      });
    }
    console.log(this.leaveForm);
  }

  validationMessage: string = '';
  today: string;

  leaveForm!: FormGroup;

  // ngOnChanges() {
  //   if (this.overtimeData) {
  //     this.overtimeForm.patchValue(this.overtimeData); // 🔥 Pre-fill form
  //   }
  // }

  // ✅ This ensures that when `leaveData` updates, the form updates as well
  ngOnChanges(changes: SimpleChanges) {
    if (changes['leaveData'] && this.leaveData) {
      this.leaveForm.patchValue({
        startDate: this.leaveData.startDate || '',
        endDate: this.leaveData.endDate || '',
        reason: this.leaveData.reason || '',
        type: this.leaveData.type || '', // Ensure it's the ID
      });
    }
  }

  constructor(
    private fb: FormBuilder,
    private featuresService: FeaturesService,
    private snackbarService: SnackbarService,
  ) {
    this.today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

    this.leaveForm = this.fb.group({
      startDate: ['', [Validators.required, this.noPastDatesValidator()]],
      endDate: ['', [Validators.required, this.noPastDatesValidator()]],
      reason: ['', [Validators.required, Validators.minLength(5)]],
      type: ['', Validators.required] // Dropdown selection
    });

    // 🔥 Automatically check for changes and clear the message
    this.leaveForm.valueChanges.subscribe(() => {
      if (this.leaveForm.valid) {
        this.validationMessage = '';
      }
    });

  }

  // ⬇️ Custom Validator to Prevent Past Dates
noPastDatesValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null; // If empty, let required validator handle it

    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Remove time for accurate comparison

    return selectedDate < today ? { pastDate: true } : null; // ❌ Invalid if past date
  };
}

  closeModal() {
    this.close.emit(); // Notify parent component to close modal

  }

  isInvalid(field: string): boolean {
    return this.leaveForm.controls[field].touched && this.leaveForm.controls[field].invalid;
  }

  submit() {
   if (this.leaveForm.invalid) {
      this.validationMessage = 'Please fill in all required fields correctly.';
      // 🔥 Force validation errors to show
      Object.keys(this.leaveForm.controls).forEach(field => {
        const control = this.leaveForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      return;
    }

    // ✅ Clear validation message if form is valid
    this.validationMessage = '';

    if (!this.leaveData || !this.leaveData.id) {
      this.snackbarService.showError("Error: No overtime request selected.");

      return;
    }

    const formData = this.leaveForm.value;
    const id = this.leaveData.id; // Get ID from selected overtime

    this.featuresService.updateLeaveRequest(id, formData).subscribe({
      next: (response) => {
        if (response.status === 'SUCCESS' && response.data === null) {
          // ❌ Don't close modal if validation error exists
          console.warn('Validation Error:', response.message);
          this.validationMessage = response.message; // Store error message
        } else {
          // ✅ Close modal only if request is truly successful
          this.snackbarService.showSuccess(response.message);
          this.refreshTable.emit(); // ✅ Emit event to refresh table
          this.closeModal();
        }
      },
      error: (error) => {
        this.snackbarService.showError(error);
      }
    });
  }

  cancelLeaveRequest() {
    if (!this.leaveData.id) {
      this.snackbarService.showError("Error: No leave request selected.");
      return;
    }

    const id = this.leaveData.id; // Get ID from selected overtime

    this.featuresService.cancelLeaveRequest(id).subscribe({
      next: (response) => {
        if (response.status === 'SUCCESS' && response.data === null) {
          // ❌ Don't close modal if validation error exists
          console.warn('Validation Error:', response.message);
          this.validationMessage = response.message; // Store error message
        } else {
          // ✅ Close modal only if request is truly successful
          this.snackbarService.showSuccess(response.message);
          this.refreshTable.emit(); // ✅ Emit event to refresh table
          this.closeModal();
        }
      },
      error: (error) => {
        this.snackbarService.showError(error);
      }
    });
  }
}
