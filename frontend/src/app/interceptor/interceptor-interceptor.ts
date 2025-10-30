import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { AuthService } from '../services/auth/auth-service';
import { LoaderService } from '../services/loader/loader-service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService, private loader: LoaderService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const showLoader = ['POST', 'PUT', 'DELETE'].includes(req.method.toUpperCase());

    if (showLoader) this.loader.show();

    const token = this.auth.getToken?.();
    const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

    const start = Date.now();
    return next.handle(authReq).pipe(
      finalize(() => {
        if (showLoader) {
          const elapsed = Date.now() - start;
          const minTime = 400;
          if (elapsed < minTime) {
            setTimeout(() => this.loader.hide(), minTime - elapsed);
          } else {
            this.loader.hide();
          }
        }
      })
    );
  }
}
