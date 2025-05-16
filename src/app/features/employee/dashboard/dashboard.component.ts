import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { SnackbarComponent } from "../../../shared/snackbar/snackbar.component";
import { Geolocation } from '@capacitor/geolocation'; // If using Capacitor for location
import { FeaturesService } from '../../features.service';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { LoaderComponent } from "../../../shared/loader/loader.component";
import { LoaderService } from '../../../loader.service';


@Component({
  selector: 'app-dashboard',
  imports: [MatButtonModule, SnackbarComponent, SnackbarComponent, LoaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentDate: string = '';
  currentTime: string = '';

  constructor(private featuresService: FeaturesService,
    private snackbarService: SnackbarService, private loaderService: LoaderService) {}

  ngOnInit(): void {
    this.updateTime();
    setInterval(() => this.updateTime(), 1000); // Update clock every second
  }

  updateTime() {
    const now = new Date();

    // Format date: Monday, January 01, 2025
    this.currentDate = now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    });

    // Format time: 12:34:56 PM
    this.currentTime = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  }


  async clockIn() {
    try {
      this.loaderService.show();
      // Get user's location
      const coordinates = await Geolocation.getCurrentPosition();
      const latitude = coordinates.coords.latitude;
      const longitude = coordinates.coords.longitude;

      // Call the clock-in function
      this.featuresService.clockIn(latitude, longitude).subscribe({
        next: (response: any) => {
          if (!response) {
            this.snackbarService.showError("No response from server. Please try again.");
            return;
          }
          if (response.status === "SUCCESS") {
            this.snackbarService.showSuccess(response.message);

          } else {
            this.snackbarService.showError("Something went wrong. Try again.");
          }
        },
        error: (error) => {
          this.snackbarService.showError(error || "Clock-in failed. Please try again.");
        }
      });
    } catch (error) {
      this.snackbarService.showError("Could not get location. Please enable GPS.");
    }
  }



  startBreak() {
    this.loaderService.show();

    this.featuresService.startBreak().subscribe({
        next: (response) => {
            this.snackbarService.showSuccess(response.message);
        },
        error: (error) => {
            this.snackbarService.showError(error.message || "Start break failed.");
        }
    });
  }

  endBreak() {
    this.loaderService.show();

    this.featuresService.endBreak().subscribe({
        next: (response) => {
          this.snackbarService.showSuccess(response.message);
          console.log(response);
        },
        error: (error) => {
          this.snackbarService.showError(error.message || "End break failed.");
        }
    });
  }

  clockOut() {
    this.loaderService.show();

    this.featuresService.clockOut().subscribe({
      next: (response) => {
        this.snackbarService.showSuccess(response.message);
        console.log(response);
      },
      error: (error) => {
        this.snackbarService.showError(error.message || "Clock-out failed.");
      }
    });
  }
}
