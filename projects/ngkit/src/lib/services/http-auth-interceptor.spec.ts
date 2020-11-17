import { Authentication } from './authentication/authentication';
import { Event } from './event';
import { HttpAuthInterceptor } from './http-auth-interceptor';
import { NgKitModule } from '../ngkit.module';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";

describe("HttpAuthInteceptor", () => {
  let auth: Authentication;
  let event: Event;
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgKitModule],
    });

    auth = TestBed.inject(Authentication);
    event = TestBed.inject(Event);
    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should broadcast auth:required when it receives a 401 status", () => {
    event.listen("auth:required").subscribe((error) => {
      console.log("LOG: error", error);
      expect(error.status).toEqual(401);
    });

    httpClient.get("/").subscribe({
      next: () => null,
      error: () => null,
    });

    const request = httpMock.expectOne("/");

    request.error(new ErrorEvent("Unauthorized"), {
      status: 401,
    });
  });

  it("should broadcast auth:expired when it receives a 419 status", () => {
    event.listen("auth:expired").subscribe((error) => {
      expect(error.status).toEqual(419);
    });

    httpClient.get("/").subscribe({
      next: () => null,
      error: () => null,
    });

    const request = httpMock.expectOne("/");

    request.error(new ErrorEvent("CSRF token mismatch."), {
      status: 419,
    });
  });

  it("should retry initial request when auth is expired and pause other requests while refreshing", (done) => {
    let index = 0;

    event.listen("auth:expired").subscribe((error) => {
      expect(error.status).toEqual(419);

      auth.refreshing(async () => {
        return await new Promise((resolve) => {
          setTimeout(() => {
            httpClient.get("/csrf").subscribe({
              next: () => {
                expect(index).toEqual(0);
                index++;
                resolve(true);
              },
            });

            const request2 = httpMock.expectOne("/csrf");

            request2.flush(
              {},
              {
                headers: {
                  "XSRF-TOKEN": "TOKEN",
                },
              }
            );
          }, 100);
        });
      });
    });

    httpClient.get("/").subscribe({
      next: () => {
        expect(index).toEqual(1);
        index++;

        // The Retry
        const retry = httpMock.expectOne("/");
        retry.flush("Retry");
      },
      error: () => null,
    });

    const request = httpMock.expectOne("/");

    request.error(new ErrorEvent("Unauthorized"), {
      status: 419,
    });

    httpClient.get("/").subscribe({
      next: () => {
        expect(index).toEqual(2);
      },
      error: () => null,
    });

    const request3 = httpMock.expectOne("/");

    request3.flush("Success");

    setTimeout(() => done(), 200);
  });
});
