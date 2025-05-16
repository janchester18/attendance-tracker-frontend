import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FeaturesService } from '../../../features/features.service';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.css'
})
export class AddEmployeeComponent {
  @Output() close = new EventEmitter<void>(); // Emits event to close modal
  @Output() submitRequest = new EventEmitter<any>(); // Emits event with form data
  @Output() refreshTable = new EventEmitter<void>(); // Emits event to refresh table

  validationMessage: string = '';

  userForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private featuresService: FeaturesService,
    private snackbarService: SnackbarService,
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]], // Validates phone number (10-15 digits)
      password: ['', [Validators.required, Validators.minLength(6)]], // Ensures password is at least 6 characters
      role: [null, Validators.required] // Role must be selected
    });

    // 🔥 Automatically clear validation message when form changes
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
    return this.userForm.controls[field].touched && this.userForm.controls[field].invalid;
  }

  submit() {
    if (this.userForm.invalid) {
      this.validationMessage = 'Please fill in all required fields correctly.';
      Object.keys(this.userForm.controls).forEach(field => {
        const control = this.userForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      return;
    }

    this.validationMessage = '';

    if (this.userForm.valid) {
      this.featuresService.addUser(this.userForm.value).subscribe({
        next: (response) => {
          if (response.status === 'SUCCESS') {
            console.log('User added successfully:', response);
            this.submitRequest.emit(response);
            this.snackbarService.showSuccess(response.message);
            this.refreshTable.emit(); // ✅ Refresh table after success
            this.closeModal();
          } else {
            console.warn('Validation Error:', response.message);
            this.validationMessage = response.message; // Store error message
          }
        },
        error: (error) => {
          console.error('Error adding user:', error.message);
          this.snackbarService.showError(error.message);
        }
      });
    }
  }
}
