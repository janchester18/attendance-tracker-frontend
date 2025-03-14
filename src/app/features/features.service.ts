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
  private baseUrl = 'http://10.0.0.32:3000';

  // private baseUrl = "https://67ce827a125cd5af757abfbb.mockapi.io/device/laptop";

  constructor(private http: HttpClient) {}

  addLaptop(laptop: any): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      }),
    };

    return this.http
      .post<any>(`${this.baseUrl}/device/laptop`, laptop, options)
      .pipe(retry(3), catchError(this.handleError));
  }

  getAllLaptop(): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };

    return this.http.get<any>(`${this.baseUrl}/device/laptop`, options).pipe(
      map((data: any) => data),
      retry(3),
      catchError(this.handleError)
    );
  }
  
  addEmployee(laptop: any): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      }),
    };

    return this.http
      .post<any>(`${this.baseUrl}/user/employee`, this.addEmployee, options)
      .pipe(retry(3), catchError(this.handleError));
  }


  getAllEmployee(): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };

    
    return this.http.get<any>(`${this.baseUrl}/user/employee`, options).pipe(
      map((data: any) => data),
      retry(3),
      catchError(this.handleError)
    );
  }
  

  getLaptopById(id: number): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };

    return this.http
      .get<any>(`${this.baseUrl}/${id}`, options)
      .pipe(retry(3), catchError(this.handleError));
  }

  updateLaptop(id: number, laptop: any): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };

    return this.http
      .put<any>(`${this.baseUrl}/device/laptop/${id}`, laptop, options)
      .pipe(retry(3), catchError(this.handleError));
  }
  getEmployeeById(id: number): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };

    return this.http
      .get<any>(`${this.baseUrl}/${id}`, options)
      .pipe(retry(3), catchError(this.handleError));
  }
  updateEmployee(id: number, employeeData: any): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };
    // emoployeeData
    return this.http
      .put<any>(`${this.baseUrl}/device/laptop/${id}`, employeeData, options)
      .pipe(retry(3), catchError(this.handleError));
  }

  disableLaptop(id: number): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };

    return this.http
      .patch<any>(`${this.baseUrl}/${id}`, { status: 'disabled' }, options)
      .pipe(retry(3), catchError(this.handleError));
  }

  deleteLaptop(id: number): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };

    return this.http
      .put<any>(`${this.baseUrl}/${id}`, options)
      .pipe(retry(3), catchError(this.handleError));
  }

  deleteEmployee(id: number): Observable<any> {
    const token = sessionStorage.getItem('auth_token');
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };

    return this.http
      .put<any>(`${this.baseUrl}/${id}`, options)
      .pipe(retry(3), catchError(this.handleError));
  }

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
