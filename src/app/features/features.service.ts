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
  private baseUrl = 'http://10.0.0.19:5249';

  // private baseUrl = "https://67ce827a125cd5af757abfbb.mockapi.io/device/laptop";

  constructor(private http: HttpClient, private router: Router) {}

  getSelfAttendanceHistory(page: number = 1, pageSize: number = 10): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };

    return this.http.get<any>(`${this.baseUrl}/api/Attendance/self?page=${page}&pageSize=${pageSize}`, options).pipe(
        map((data: any) => data),
        retry(3),
        catchError(this.handleError)
      );
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
