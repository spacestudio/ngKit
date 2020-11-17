import { Config } from './config';
import { AuthGuard } from './guards/auth-guard';
import { AuthResolveGuard } from './guards/auth-resolve-guard';
import { Authentication } from './services/authentication/authentication';
import { Authorization } from './services/authentication/authorization';
import { Cache } from './services/cache/cache';
import { Crypto } from './services/encryption/crypto';
import { Event } from './services/event';
import { Http } from './services/http';
import { HttpAuthInterceptor } from './services/http-auth-interceptor';
import { HttpInterceptor } from './services/http-interceptor';
import { CookieStorage } from './services/storage/cookie';
import { LocalStorage } from './services/storage/local';
import { SessionStorage } from './services/storage/session';
import { Token } from './services/token/token';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

/**
 * ngKit Services.
 */
export const NGKIT_PROVIDERS: any[] = [
  Authentication,
  AuthGuard,
  AuthResolveGuard,
  Authorization,
  Cache,
  Config,
  Event,
  CookieStorage,
  Crypto,
  Http,
  LocalStorage,
  SessionStorage,
  Token,
  {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpInterceptor,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpAuthInterceptor,
    multi: true,
  },
];
