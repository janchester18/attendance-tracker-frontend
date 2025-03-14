import { NgIf } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [NgIf],
})
export class LoginComponent {
  @ViewChild('usernameInput') usernameInput!: ElementRef;
  @ViewChild('passwordInput') passwordInput!: ElementRef;
  errorMessage: string = '';

  // Mock user credentials
  private mockUsers = [
    { username: 'jonapogs', password: '1234' },
    { username: 'user', password: 'user123' },
  ];

  constructor(private router: Router) {}

  login() {
    const username = this.usernameInput.nativeElement.value;
    const password = this.passwordInput.nativeElement.value;

    // Check if entered credentials match any mock user
    const user = this.mockUsers.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      this.errorMessage = ''; // Clear any previous error messages
      this.router.navigate(['/main/dashboard']); // ✅ Navigate to Dashboard
    } else {
      this.errorMessage = 'Invalid username or password';
    }
  }
}
