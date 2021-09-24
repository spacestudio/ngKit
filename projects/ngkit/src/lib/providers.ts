import { ConfigSerivce } from './config.service';
import { AuthResolveGuard } from './guards/auth-resolve.guard';
import { AuthGuard } from './guards/auth.guard';
import { AuthenticationService } from './services/authentication/authentication.service';
import { AuthorizationService } from './services/authentication/authorization.service';
import { CacheService } from './services/cache/cache.service';
import { CryptoService } from './services/encryption/crypto.service';
import { EventSerivce } from './services/event.service';
import { AuthInterceptor } from './services/http-auth-interceptor';
import { HttpInterceptor } from './services/http-interceptor';
import { HttpService } from './services/http.service';
import { CookieStorageService } from './services/storage/cookie-storage.service';
import { IDBStorageService } from './services/storage/idb-storage.service';
import { LocalStorageService } from './services/storage/local-storage.service';
import { SessionStorageService } from './services/storage/session-storage.service';
import { StorageService } from './services/storage/storage.service';
import { TokenService } from './services/token/token.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

/**
 * ngKit Services.
 */
export const NGKIT_PROVIDERS: any[] = [
  AuthenticationService,
  AuthGuard,
  AuthResolveGuard,
  AuthorizationService,
  CacheService,
  ConfigSerivce,
  EventSerivce,
  CookieStorageService,
  CryptoService,
  HttpService,
  IDBStorageService,
  LocalStorageService,
  SessionStorageService,
  StorageService,
  TokenService,
  {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpInterceptor,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
  },
];
