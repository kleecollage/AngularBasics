import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const authToken = authService.getToken();
  // console.log(authToken);

  const authRequest = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${authToken}`),
  });

  return next(authRequest);
};

// NEXT INTERCEPTOR IS NOT FOR STANDALONE APPS
// import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
// import { Injectable } from "@angular/core";
// import { Observable } from "rxjs";
// import { AuthService } from "./auth.service";

// @Injectable()
// export class AuthInterceptor implements HttpInterceptor {
//   constructor(private authService: AuthService) {}

//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     const authToken = this.authService.getToken();
//     console.log(authToken);
//     const authRequest = req.clone({
//       headers: req.headers.set("Authorization", "Bearer " + authToken)
//     });

//     return next.handle(authRequest);
//   }
// }
