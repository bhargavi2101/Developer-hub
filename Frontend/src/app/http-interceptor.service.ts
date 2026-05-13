import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('HTTP Error:', error);

        // Handle 401 Unauthorized errors
        if (error.status === 401) {
          localStorage.removeItem('token');
          this.router.navigate(['/login'], {
            queryParams: { returnUrl: this.router.url }
          });
        }

        // Handle 403 Forbidden errors
        if (error.status === 403) {
          this.router.navigate(['/dashboard']);
        }

        // Create user-friendly error message
        let errorMessage = 'An error occurred';

        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Server-side error
          errorMessage = error.error?.msg || error.error?.message || `Error Code: ${error.status}\nMessage: ${error.message}`;
        }

        console.error('Error Message:', errorMessage);

        // Return the error to the calling service
        return throwError(() => ({
          status: error.status,
          message: errorMessage,
          originalError: error
        }));
      })
    );
  }
}
