import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { SnackbarComponent } from "../../shared/snackbar/snackbar.component";
import { Geolocation } from '@capacitor/geolocation'; // If using Capacitor for location
import { FeaturesService } from '../features.service';


@Component({
  selector: 'app-dashboard',
  imports: [MatButtonModule, SnackbarComponent, SnackbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  time: string = '';

  constructor(private featuresService: FeaturesService) {}

  ngOnInit(): void {
    this.updateTime();
    setInterval(() => this.updateTime(), 1000); // Update clock every second
  }

  updateTime() {
    const now = new Date();
    this.time = now.toLocaleTimeString();
  }

  async clockIn() {
    try {
      // Get user's location
      const coordinates = await Geolocation.getCurrentPosition();
      const latitude = coordinates.coords.latitude;
      const longitude = coordinates.coords.longitude;

      // Call the clock-in function
      this.featuresService.clockIn(latitude, longitude).subscribe({
        next: (response: any) => {
          console.log("Full Response from API:", response); // Debugging

          if (!response) {
            alert("No response from server. Please try again.");
            console.error("Null or undefined response received.");
            return;
          }

          console.log("Response status:", response.status);
          console.log("Response message:", response.message);
          console.log("Response data:", response.data);

          if (response.status === "SUCCESS") {
            alert(response.message);
          } else {
            alert("Something went wrong. Try again.");
          }
        },
        error: (error) => {
          alert("Clock-in failed. Please try again.");
          console.error("Clock-in error:", error);
        }
      });
    } catch (error) {
      alert("Could not get location. Please enable GPS.");
      console.error("Geolocation error:", error);
    }
  }



  startBreak() {
    this.featuresService.startBreak().subscribe({
        next: (response) => {
            alert(response.message);
            console.log(response);
        },
        error: (error) => {
            alert(error.message || "Start break failed.");
            console.error(error);
        }
    });
  }

  endBreak() {
    this.featuresService.endBreak().subscribe({
        next: (response) => {
            alert(response.message);
            console.log(response);
        },
        error: (error) => {
            alert(error.message || "End break failed.");
            console.error(error);
        }
    });
  }

  clockOut() {
    this.featuresService.clockOut().subscribe({
        next: (response) => {
            alert(response.message);
            console.log(response);
        },
        error: (error) => {
            alert(error.message || "Clock-out failed.");
            console.error(error);
        }
    });
  }
}
