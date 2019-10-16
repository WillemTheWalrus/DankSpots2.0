
import { throwError as observableThrowError, Observable } from 'rxjs';
import { Injectable, Injector } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse
} from '@angular/common/http';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { isNullOrUndefined } from 'util';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private injector: Injector, private router: Router) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const authService = this.injector.get(AuthService);
        const authReq = req.clone({ headers: req.headers, withCredentials: true });
        return next.handle(authReq).pipe(map((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
                if (isNullOrUndefined(event)) {
                    this.router.navigate(['/login']); }
                return event;
            }
        }), catchError(err => {
            if (err instanceof HttpErrorResponse) {
                if (err.status === 401 || err.status === 0) {
                    this.router.navigate(['/login']);
                }
            }
            return observableThrowError(err);
        }));
    }

}
