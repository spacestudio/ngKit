import { Http } from './http';
import { Config } from '../config';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/dist/types/operators';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor as Interceptor,
  HttpRequest,
} from "@angular/common/http";

@Injectable()
export class HttpInterceptor implements Interceptor {
  /**
   * Create a new instance of the interceptor.
   */
  constructor(private config: Config, public http: Http) {}

  /**
   * Intercept the http request.
   */
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    req = req.clone({
      url: this.http.getUrl(req.url),
    });

    if (this.config.get("authentication.driver") === "token") {
      req = req.clone({
        headers: this.http.headers,
      });
    }

    if (this.config.get("authentication.driver") === "session") {
      req = req.clone({
        withCredentials: true,
      });
    }

    return next.handle(req);
  }
}
