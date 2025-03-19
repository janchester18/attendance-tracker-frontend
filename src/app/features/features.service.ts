import { Router } from '@angular/router';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, retry, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FeaturesService {
  private baseUrl = 'http://10.0.0.6:5249';

  // private baseUrl = "https://67ce827a125cd5af757abfbb.mockapi.io/device/laptop";

  constructor(private http: HttpClient, private router: Router) {}

  getSelfAttendanceHistory(page: number = 1, pageSize: number = 10): Observable<any> {
    const url = `${this.baseUrl}/api/Attendance/self?page=${page}&pageSize=${pageSize}`;
    return this.sendGetRequest(url);
  }

  getSelfOvertimeRequests(page: number = 1, pageSize: number = 10): Observable<any> {
    const url = `${this.baseUrl}/api/Overtime/self?page=${page}&pageSize=${pageSize}`;
    return this.sendGetRequest(url);
  }

  getSelfLeaveRequests(page: number = 1, pageSize: number = 10): Observable<any> {
    const url = `${this.baseUrl}/api/Leave/self?page=${page}&pageSize=${pageSize}`;
    return this.sendGetRequest(url);
  }

    /** 🔹 Login Function */
  login(email: string, password: string): Observable<any> {
    const url = `${this.baseUrl}/api/Auth/Login`; // Adjust if needed

    console.log('Login API URL:', url);

    const body = { email, password };

    return this.http.post<any>(url, body).pipe(
      map((response: any) => {
        if (response.status === 'SUCCESS' && response.data?.accessToken) {
          // Store tokens in sessionStorage
          sessionStorage.setItem('auth_token', response.data.accessToken);
          sessionStorage.setItem('refresh_token', response.data.refreshToken);
          return response.data; // Return only token data
        } else {
          throw new Error(response.message || 'Login failed');
        }
      }),
      catchError(this.handleError)
    );
  }

  logout(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionStorage.getItem('auth_token')}`
    });

    return this.http.post(`${this.baseUrl}/api/auth/logout`, {}, { headers });
  }

  clockIn(latitude: number, longitude: number): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const url = `${this.baseUrl}/api/Attendance/clockin`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    const body = {
      clockInLatitude: latitude,
      clockInLongitude: longitude
    };

    return this.http.post<any>(url, body, { headers }).pipe(
      map(response => {
        if (response.status === 'SUCCESS') {
          return response; // Return clock-in response
        } else {
          throw new Error(response.message || 'Clock-in failed');
        }
      }),
      catchError(this.handleError)
    );
  }

  startBreak(): Observable<any> {
    return this.sendPutRequest('/api/Attendance/start-break');
  }

  endBreak(): Observable<any> {
      return this.sendPutRequest('/api/Attendance/end-break');
  }

  clockOut(): Observable<any> {
    return this.sendPutRequest('/api/Attendance/clockout');
  }

  updateOvertimeRequest(id: number, formData: any): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const url = `${this.baseUrl}/api/Overtime/update/${id}`; // API endpoint with ID

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.put<any>(url, formData, { headers }).pipe(
      map(response => {
        if (response.status === 'SUCCESS') {
          return response;
        } else {
          throw new Error(response.message || 'Overtime update failed');
        }
      }),
      catchError(this.handleError)
    );
  }

  cancelOvertimeRequest(id: number): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const url = `${this.baseUrl}/api/Overtime/cancel/${id}`; // API endpoint with ID

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.put<any>(url, {}, { headers }).pipe(
      map(response => {
        if (response.status === 'SUCCESS') {
          return response;
        } else {
          throw new Error(response.message || 'Overtime cancellation failed');
        }
      }),
      catchError(this.handleError)
    );
  }

  updateLeaveRequest(id: number, formData: any): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const url = `${this.baseUrl}/api/Leave/update/${id}`; // API endpoint with ID

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.put<any>(url, formData, { headers }).pipe(
      map(response => {
        if (response.status === 'SUCCESS') {
          return response;
        } else {
          throw new Error(response.message || 'Leave update failed');
        }
      }),
      catchError(this.handleError)
    );
  }

  cancelLeaveRequest(id: number): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const url = `${this.baseUrl}/api/Leave/cancel/${id}`; // API endpoint with ID

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.put<any>(url, {}, { headers }).pipe(
      map(response => {
        if (response.status === 'SUCCESS') {
          return response;
        } else {
          throw new Error(response.message || 'Overtime cancellation failed');
        }
      }),
      catchError(this.handleError)
    );
  }



  // ✅ Function to submit an overtime/leave request
  addLeaveRequest(leaveRequest: any): Observable<any> {
    const token = sessionStorage.getItem('auth_token'); // Retrieve token from session
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };

    return this.http
      .post<any>(`${this.baseUrl}/api/Leave`, leaveRequest, options)
      .pipe(retry(3), catchError(this.handleError)); // Retry 3 times & handle errors
  }

  // handleLogout() {
  //   this.logout().subscribe({
  //     next: (response) => {
  //       console.log(response.message);
  //       localStorage.removeItem('auth_token'); // Remove JWT from local storage
  //       localStorage.removeItem('refresh_token'); // Remove refresh token if used
  //       this.router.navigate(['/login']); // Redirect to login page
  //     },
  //     error: (error) => {
  //       console.error('Logout failed:', error);
  //     }
  //   });
  // }

  handleLogout(): void {
    this.logout().subscribe({
      next: (response) => {
        console.log('Logout response:', response.message);
        try {
          sessionStorage.removeItem('auth_token');
          sessionStorage.removeItem('refresh_token');
          console.log('Tokens removed from sessionStorage.');
        } catch (error) {
          console.error('Error removing tokens:', error);
        }
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout failed:', error);
      }
    });
  }

  addLaptop(laptop: any): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      }),
    };

    return this.http
      .post<any>(`${this.baseUrl}/device/laptop/?pageSize=30&page=1`, laptop, options)
      .pipe(retry(3), catchError(this.handleError));
  }

  private sendPutRequest(endpoint: string): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const url = `${this.baseUrl}${endpoint}`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.put<any>(url, {}, { headers }).pipe(
      map(response => {
        if (response.status === 'SUCCESS') {
          return response;
        } else {
          throw new Error(response.message || 'Request failed');
        }
      }),
      catchError(this.handleError)
    );
  }

  sendGetRequest(url: string): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };

    return this.http.get<any>(url, options).pipe(
      map((data: any) => data),
      retry(3),
      catchError(this.handleError)
    );
  }

  // getAllLaptop(): Observable<any> {
  //   const token = sessionStorage.getItem('auth_token');
  //   const options = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer ${token}`,
  //     }),
  //   };

  //   return this.http.get<any>(`${this.baseUrl}/device/laptop`, options).pipe(
  //     map((data: any) => data),
  //     retry(3),
  //     catchError(this.handleError)
  //   );
  // }

  // addEmployee(laptop: any): Observable<any> {
  //   const token = sessionStorage.getItem('auth_token');
  //   const options = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       Authorization: `${token}`,
  //     }),
  //   };

  //   return this.http
  //     .post<any>(`${this.baseUrl}/user/employee`, this.addEmployee, options)
  //     .pipe(retry(3), catchError(this.handleError));
  // }


  // getAllEmployee(): Observable<any> {
  //   const token = sessionStorage.getItem('auth_token');
  //   const options = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer ${token}`,
  //     }),
  //   };


  //   return this.http.get<any>(`${this.baseUrl}/user/employee`, options).pipe(
  //     map((data: any) => data),
  //     retry(3),
  //     catchError(this.handleError)
  //   );
  // }


  // getLaptopById(id: number): Observable<any> {
  //   const token = sessionStorage.getItem('auth_token');
  //   const options = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer ${token}`,
  //     }),
  //   };

  //   return this.http
  //     .get<any>(`${this.baseUrl}/${id}`, options)
  //     .pipe(retry(3), catchError(this.handleError));
  // }

  // updateLaptop(id: number, laptop: any): Observable<any> {
  //   const token = sessionStorage.getItem('auth_token');
  //   const options = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer ${token}`,
  //     }),
  //   };

  //   return this.http
  //     .put<any>(`${this.baseUrl}/device/laptop/${id}`, laptop, options)
  //     .pipe(retry(3), catchError(this.handleError));
  // }
  // getEmployeeById(id: number): Observable<any> {
  //   const token = sessionStorage.getItem('auth_token');
  //   const options = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer ${token}`,
  //     }),
  //   };

  //   return this.http
  //     .get<any>(`${this.baseUrl}/${id}`, options)
  //     .pipe(retry(3), catchError(this.handleError));
  // }
  // updateEmployee(id: number, employeeData: any): Observable<any> {
  //   const token = sessionStorage.getItem('auth_token');
  //   const options = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer ${token}`,
  //     }),
  //   };
  //   // emoployeeData
  //   return this.http
  //     .put<any>(`${this.baseUrl}/device/laptop/${id}`, employeeData, options)
  //     .pipe(retry(3), catchError(this.handleError));
  // }

  // disableLaptop(id: number): Observable<any> {
  //   const token = sessionStorage.getItem('auth_token');
  //   const options = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer ${token}`,
  //     }),
  //   };

  //   return this.http
  //     .patch<any>(`${this.baseUrl}/${id}`, { status: 'disabled' }, options)
  //     .pipe(retry(3), catchError(this.handleError));
  // }

  // deleteLaptop(id: number): Observable<any> {
  //   const token = sessionStorage.getItem('auth_token');
  //   const options = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer ${token}`,
  //     }),
  //   };

  //   return this.http
  //     .put<any>(`${this.baseUrl}/${id}`, options)
  //     .pipe(retry(3), catchError(this.handleError));
  // }

  // deleteEmployee(id: number): Observable<any> {
  //   const token = sessionStorage.getItem('auth_token');
  //   const options = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer ${token}`,
  //     }),
  //   };

  //   return this.http
  //     .put<any>(`${this.baseUrl}/${id}`, options)
  //     .pipe(retry(3), catchError(this.handleError));
  // }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: ${error.error}`
      );
    }
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }
}
