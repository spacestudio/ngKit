import { Injectable } from '@angular/core';
import { Http } from './http';
import { Event } from './event';
import {
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    /**
     * Create a new instance of the interceptor.
     *
     * @param  {Http} http
     * @param  {Event} event
     */
    constructor(
        public http: Http,
        public event: Event,
    ) { }

    /**
     * Intercept the http request.
     *
     * @param  {HttpRequest<any>} req
     * @param  {HttpHandler} next
     * @return {Observable}
     */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).do(() => { }, error => {
            if (error instanceof HttpErrorResponse) {
                if (error.status === 401) {
                    this.event.broadcast('auth:required', error);
                }
            }
        });
    }
}
