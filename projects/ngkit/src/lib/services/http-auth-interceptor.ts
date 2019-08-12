import { Injectable } from '@angular/core';
import { Http } from './http';
import { Event } from './event';
import {
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    /**
     * Create a new instance of the interceptor.
     *
     * @param  http
     * @param  event
     */
    constructor(
        public http: Http,
        public event: Event,
    ) { }

    /**
     * Intercept the http request.
     *
     * @param  req
     * @param  next
     */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(tap(() => { }, (error: any) => {
            if (error instanceof HttpErrorResponse) {
                if (error.status === 401) {
                    this.event.broadcast('auth:required', error);
                }
            }
        }));
    }
}
