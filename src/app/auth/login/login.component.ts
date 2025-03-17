import { NgIf } from '@angular/common';
import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FeaturesService } from '../../features/features.service';
import { FormsModule, NgModel } from '@angular/forms';
import { SnackbarService } from '../../shared/snackbar/snackbar.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [NgIf, FormsModule],
})
export class LoginComponent {
  @ViewChild('usernameInput') usernameInput!: ElementRef;
  @ViewChild('passwordInput') passwordInput!: ElementRef;

  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private featuresService: FeaturesService,
    private router: Router,
    private snackbarService: SnackbarService,
    private zone: NgZone
  ) {}

  login() {
    this.featuresService.login(this.email, this.password).subscribe({
      next: () => {
        this.zone.run(() => {
          this.snackbarService.showSuccess('Login successful!');
          this.router.navigate(['/main/dashboard']);
        })
      },
      error: () => {
        this.snackbarService.showError('Login failed. Please try again.');
      }
    });
  }


  // Mock user credentials
  private mockUsers = [
    { username: '', password: '' },
    { username: 'user', password: 'user123' },
  ];


  // login() {
  //   const username = this.usernameInput.nativeElement.value;
  //   const password = this.passwordInput.nativeElement.value;

  //   // Check if entered credentials match any mock user
  //   const user = this.mockUsers.find(
  //     (u) => u.username === username && u.password === password
  //   );

  //   if (user) {
  //     this.errorMessage = ''; // Clear any previous error messages
  //     this.router.navigate(['/main/dashboard']); // ✅ Navigate to Dashboard
  //   } else {
  //     this.errorMessage = 'Invalid username or password';
  //   }
  // }
}
