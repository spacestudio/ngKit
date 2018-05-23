import { Injectable } from '@angular/core';
import { Http } from './http';
import {
    HttpEvent, HttpHandler, HttpInterceptor as Interceptor, HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HttpInterceptor implements Interceptor {
    /**
     * Create a new instance of the interceptor.
     *
     * @param  http
     */
    constructor(
        public http: Http
    ) { }

    /**
     * Intercept the http request.
     *
     * @param  req
     * @param  next
     */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        req = req.clone({
            headers: this.http.headers,
            url: this.http.getUrl(req.url)
        });

        return next.handle(req);
    }
}
