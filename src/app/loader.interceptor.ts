// loader.interceptor.ts
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize, Observable } from 'rxjs';
import { LoaderService } from './loader.service';

export const loaderInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const loaderService = inject(LoaderService);
  const apiUrl = req.url.toLowerCase(); // Normalize case

  // List of URLs that should not trigger the loader
  const excludedUrls = [
    'https://attendancetracker120250516132844-bqheg0bkbff4bkb2.southeastasia-01.azurewebsites.net/api/notification/self',
    'https://attendancetracker120250516132844-bqheg0bkbff4bkb2.southeastasia-01.azurewebsites.net/api/notification/view'
  ];

  // Check if request URL starts with any of the excluded URLs
  if (!excludedUrls.some(url => apiUrl.startsWith(url))) {
    loaderService.show();
  }

  return next(req).pipe(
    finalize(() => {
      if (!excludedUrls.some(url => apiUrl.startsWith(url))) {
        loaderService.hide();
      }
    })
  );
};


