import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { authInterceptor } from './auth/auth-interceptor';
import { AuthGuard } from './auth/auth.guard';
import { errorInterceptor } from './error-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    AuthGuard,
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    // NOT ALLOW ON STANDALONE APPS //
    // provideHttpClient(),
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: AuthInterceptor,
    //   multi: true,
    // }
   ]
};
