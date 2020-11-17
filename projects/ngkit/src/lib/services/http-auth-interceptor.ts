import { Authentication } from './authentication/authentication';
import { Event } from './event';
import { Http } from './http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import {
  concatMap,
  delay,
  retryWhen,
  switchMap,
  take,
  tap,
} from "rxjs/operators";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from "@angular/common/http";

@Injectable()
export class HttpAuthInterceptor implements HttpInterceptor {
  /**
   * Create a new instance of the interceptor.
   */
  constructor(
    private auth: Authentication,
    public http: Http,
    public event: Event
  ) {}

  /**
   * Intercept the http request.
   */
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next
      .handle(req)
      .pipe(
        switchMap(async (req) => {
          // While in the middle of refreshing auth, pause the requests.
          if (this.auth.refreshingPromise) {
            await this.auth.refreshingPromise;
          }

          return req;
        }),
        tap(
          () => {},
          (error: any) => {
            if (error instanceof HttpErrorResponse) {
              if (error.status === 401) {
                this.event.broadcast("auth:required", error);
              }

              if (error.status === 419) {
                this.event.broadcast("auth:expired", error);
              }
            }
          }
        )
      )
      .pipe(
        delay(100),
        take(2),
        retryWhen((errors) =>
          errors.pipe(
            concatMap(async (error) => {
              // Wait for the refresh.
              if (this.auth.refreshingPromise) {
                await this.auth.refreshingPromise;
              }

              // Check that the auth refresh was successful and occurred recently.
              if (
                error.status !== 419 ||
                !this.auth.refreshedAt ||
                Date.now() - this.auth.refreshedAt > 1000
              ) {
                throw error;
              }

              return error;
            })
          )
        )
      );
  }
}
