import { Injectable } from '@angular/core';
import { Http } from './http';
import {
    HttpEvent, HttpHandler, HttpInterceptor as Interceptor, HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class HttpInterceptor implements Interceptor {
    /**
     * Create a new instance of the interceptor.
     *
     * @param  {Http} http
     */
    constructor(
        public http: Http
    ) { }

    /**
     * Intercept the http request.
     *
     * @param  {HttpRequest<any>} req
     * @param  {HttpHandler} next
     * @return {Observable}
     */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        req = req.clone({
            headers: this.http.headers,
            url: this.http.getUrl(req.url)
        });

        return next.handle(req);
    }
}
