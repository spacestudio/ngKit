import { EventService } from './event.service';
import { HttpService } from './http.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from "@angular/common/http";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  /**
   * Create a new instance of the interceptor.
   */
  constructor(public http: HttpService, public eventService: EventService) {}

  /**
   * Intercept the http request.
   */
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap(
        () => {},
        (error: any) => {
          if (error instanceof HttpErrorResponse) {
            if (error.status === 401) {
              this.eventService.broadcast("auth:required", error);
            }

            if (error.status === 419) {
              this.eventService.broadcast("auth:expired", error);
            }
          }
        }
      )
    );
  }
}
