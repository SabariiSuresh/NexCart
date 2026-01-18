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
  private logoutTriggered: boolean = false;
  private readonly excludedUrls = ['/quick-search'];

  constructor(
    private auth: AuthService,
    private loader: LoaderService,
    private notify: NotificationService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const shouldShowLoader = !this.excludedUrls.some(url => req.url.includes(url)) && !req.url.includes('/assets/');

    const token = this.auth.getToken?.();

    if (shouldShowLoader) {
      if (this.activeRequests === 0) {
        this.loader.show();
      }
      this.activeRequests++;
    }

    const authReq = token
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

    return next.handle(authReq).pipe(

      catchError((error: HttpErrorResponse) => {

        const errType = error?.error?.type;

        if (error.status === 401 && errType === 'TOKEN_EXPIRED' && !this.logoutTriggered) {

          this.logoutTriggered = true;
          this.notify.error("Your session has expired!");
          this.auth.logOut();
          
        }
        return throwError(() => error);
      }),

      finalize(() => {
        if (shouldShowLoader) {
          this.activeRequests = Math.max(0, this.activeRequests - 1);

          if (this.activeRequests === 0) {
            this.loader.hide();
          }
        }
      })
    );
  }
}
