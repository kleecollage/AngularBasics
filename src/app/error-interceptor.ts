import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const observer = {
    next: (event: any) => event,
    error: (error: HttpErrorResponse) => {
      console.log(error);
      alert(error.error.message)
      return throwError(() => error);
    },
    complete: () => console.log('Error handling complete'),
  }
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => observer.error(error) )
  );
};
