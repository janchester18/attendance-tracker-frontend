import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { FeaturesService } from '../../../features/features.service';
import { SnackbarComponent } from '../../../shared/snackbar/snackbar.component';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';

@Component({
  selector: 'app-convert-mpl',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './convert-mpl.component.html',
  styleUrl: './convert-mpl.component.css'
})
export class ConvertMplComponent  {
  @Input() userData: any | null = null; // 👈 Receive data from parent
  @Output() close = new EventEmitter<void>(); // Emits event to close modal
  @Output() submitRequest = new EventEmitter<any>(); // Emits event with form data
  @Output() refreshTable = new EventEmitter<void>(); // Emits event to refresh table

  validationMessage: string = '';

  userForm!: FormGroup;

  // ngOnChanges() {
  //   if (this.overtimeData) {
  //     this.overtimeForm.patchValue(this.overtimeData); // 🔥 Pre-fill form
  //   }
  // }


  constructor(
    private fb: FormBuilder,
    private featuresService: FeaturesService,
    private snackbarService: SnackbarService,
  ) {

    this.userForm = this.fb.group({
      mplConverted: [''], // Add this
    });

    // 🔥 Automatically check for changes and clear the message
    this.userForm.valueChanges.subscribe(() => {
      if (this.userForm.valid) {
        this.validationMessage = '';
      }
    });

  }

  closeModal() {
    this.close.emit(); // Notify parent component to close modal

  }

  isInvalid(field: string): boolean {
    const control = this.userForm.get(field);
    return control ? control.touched && control.invalid : false;
  }

  submit() {
    if (this.userForm.invalid) {
      this.validationMessage = 'Please fill in all required fields correctly.';
      Object.keys(this.userForm.controls).forEach(field => {
        const control = this.userForm.get(field);
        control?.markAsTouched();
      });
      return;
    }

    this.validationMessage = '';

    if (!this.userData || !this.userData.id) {
      this.snackbarService.showError("Error: No user selected.");
      return;
    }

    const id = this.userData.id;

    this.featuresService.convertToMpl(id, this.userForm.value).subscribe({
      next: (response) => {
        if (response.status === 'SUCCESS' && response.data === null) {
          console.warn('Validation Error:', response.message);
          this.validationMessage = response.message;
        } else {
          this.snackbarService.showSuccess(response.message);
          this.refreshTable.emit();
          this.closeModal();
        }
      },
      error: (error) => {
        // Use error.message to avoid circular structure issues
        this.snackbarService.showError(error || "An error occurred");
      }
    });
  }
}
