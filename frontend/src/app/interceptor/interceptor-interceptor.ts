import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';

import { Observable, catchError, finalize, throwError } from 'rxjs';
import { AuthService } from '../services/auth/auth-service';
import { LoaderService } from '../services/loader/loader-service';
import { NotificationService } from '../services/notification/notification-service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private activeRequests = 0;
  private readonly excludedUrls = ['/quick-search'];

  constructor(
    private auth: AuthService,
    private loader: LoaderService,
    private notify: NotificationService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const shouldShowLoader = !this.excludedUrls.some(url => req.url.includes(url));

    if (shouldShowLoader) {
      this.activeRequests++;
      this.loader.show();
    }

    const token = this.auth.getToken?.();
    const authReq = token
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

    return next.handle(authReq).pipe(

      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.notify.error("Your session has expired!");
          this.auth.logOut();
        }
        return throwError(() => error);
      }),

      finalize(() => {
        if (shouldShowLoader) {
          this.activeRequests--;
          if (this.activeRequests === 0) {
            setTimeout(() => this.loader.hide(), 150);
          }
        }
      })
    );
  }
}
