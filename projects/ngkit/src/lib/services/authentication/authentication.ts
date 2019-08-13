import { HttpClient } from '@angular/common/http';
import { Http } from '../http';
import { Authorization } from './authorization';
import { Injectable, OnDestroy } from '@angular/core';
import { UserModel } from '../../models/index';
import { Config } from '../../config';
import { Token } from '../token/token';
import { Event } from '../event';
import { Observable, Observer } from 'rxjs';

@Injectable()
export class Authentication implements OnDestroy {
  /**
   * Create a new instance of the service.
   */
  constructor(
    public authorization: Authorization,
    public config: Config,
    public event: Event,
    public http: HttpClient,
    public httpService: Http,
    public token: Token
  ) {
    this.event.setChannels(this.channels);
    this.eventListeners();
  }

  /**
   * Authorized user.
   */
  private authUser: any = null;

  /**
   * State of the user authentication.
   */
  authenticated: boolean;

  /**
   * Event channels.
   */
  protected channels: string[] = [
    'auth:login',
    'auth:logginIn',
    'auth:loggedIn',
    'auth:logout',
    'auth:loggingOut',
    'auth:loggedOut',
    'auth:required',
    'auth:check',
    'auth:guarded',
    'auth:registered',
  ];

  /**
   * The redirect data on the service.
   */
  private redirect: any = null

  /**
   * The subsciptions of the service.
   */
  protected subs: any = {};

  /**
   * The timeouts of the component.
   */
  protected timeouts: any = {};

  /**
   * The unauthenticated handler of the service.
   */
  unAuthenticatedHandler: Function = () => { };

  /**
   * On service destroy.
   */
  ngOnDestroy(): void {
    Object.keys(this.subs).forEach(k => this.subs[k].unsubscribe());
    Object.keys(this.timeouts).forEach(k => clearTimeout(this.timeouts[k]));
  }

  /**
   * Check if user is logged in.
   */
  check(force: boolean = false, endpoint: string = null): Observable<boolean> {
    endpoint = this.config.get('authentication.endpoints.check', endpoint);

    this.event.broadcast('auth:check');

    return new Observable(observer => {
      if (this.authenticated === false) {
        this.checkResolve(observer, false);
      } else if (this.authenticated === true && !force) {
        this.event.broadcast('auth:loggedIn', this.user());
        this.checkResolve(observer, true);
      } else {
        this.httpService.tokenHeader().then((token) => {
          if (token) {
            this.getUser(endpoint).subscribe((res) => {
              this.setAuthenticated(true);
              this.setUser(res.data || res);
              this.event.broadcast('auth:loggedIn', this.user());
              this.checkResolve(observer, true);
            }, (err) => {
              this.setAuthenticated(false);
              this.event.broadcast('auth:required', true);
              this.checkResolve(observer, false);
              observer.error(err);
            });
          } else {
            this.setAuthenticated(false);
            this.checkResolve(observer, false);
          }
        }, err => observer.error(err));
      }
    });
  }

  /**
   * Resolve the auth check.
   */
  private checkResolve(observer: Observer<boolean>, authenticated: boolean): void {
    this.event.broadcast('auth:check', authenticated).then(() => {
      this.timeouts['checkResolve'] = setTimeout(() => {
        observer.next(authenticated);
      }, 100);
    });
  }

  /**
   * The service event listeners.
   */
  private eventListeners(): void {
    this.subs['auth:loggedIn'] = this.event.listen('auth:loggedIn').subscribe((user) => {
      this.setAuthenticated(true);
      this.setUser(user);
    });
  }

  /**
   * Send a forgot password request.
   */
  forgotPassword(data: any, endpoint: string = '', headers = {}): Promise<any> {
    endpoint = this.config.get(
      'authentication.endpoints.forgotPassword', endpoint
    );

    return new Promise((resolve, reject) => {
      return this.http.post(endpoint, data, headers).toPromise()
        .then(res => resolve(res), error => reject(error));
    });
  }

  /**
   * Returns the redirect data.
   */
  getRedirect(): any {
    return this.redirect;
  }

  /**
   * Get the authentication token.
   */
  private getToken(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.token.get().then(token => resolve(token), err => reject(err));
    });
  }

  /**
   * Get the current authenticated user.
   */
  private getUser(endpoint: string = ''): Observable<any> {
    endpoint = this.config.get('authentication.endpoints.getUser', endpoint);

    return this.http.get(endpoint);
  }

  /**
   * Get the value authenticated value.
   */
  getAuthenticated(): boolean {
    return this.authenticated;
  }

  /**
   * Set if authenticated value.
   */
  setAuthenticated(value: boolean): boolean {
    return this.authenticated = value;
  }

  /**
   * Send a login request.
   */
  login(credentials: any, endpoint: string = '', headers = {}): Promise<any> {
    endpoint = this.config.get('authentication.endpoints.login', endpoint);

    return new Promise((resolve, reject) => {
      this.http.post(endpoint, credentials, headers).toPromise()
        .then(res => {
          this.onLogin(res).then(() => resolve(res), error => reject(error));
        }, error => reject(error));
    });
  }

  /**
   * Send a request to log the authenticated user out.
   */
  logout(endpoint: string = '', headers = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      this.event.broadcast('auth:loggingOut').then(() => {
        endpoint = this.config.get('authentication.endpoints.logout', endpoint);

        if (endpoint) {
          this.http.post(endpoint, {}, headers).toPromise().then(res => {
            this.onLogout();
            resolve(res)
          }, error => reject(error));
        } else {
          this.onLogout();
          resolve();
        }
      });
    });
  }

  /**
   * Actions to perform on login.
   */
  private onLogin(res: object): Promise<any> {
    return new Promise((resolve, reject) => {
      this.storeToken(res).then(() => {
        this.event.broadcast('auth:loggingIn', res).then(() => {
          this.resolveUser().then(() => resolve(), err => reject(err));
        }, err => reject(err));
      }, err => reject(err));
    });
  }

  /**
   * Actions to perform on logout.
   */
  private onLogout(): void {
    this.unauthenticate();
    this.event.broadcast('auth:loggedOut');
  }

  /**
   * Returns and clears the redirect data.
   */
  pullRedirect(): any {
    let redirect = this.redirect;

    this.redirect = null;

    return redirect;
  }

  /**
   * Send a register request.
   */
  register(data: object, endpoint: string = '', headers = {}): Promise<any> {
    endpoint = this.config.get('authentication.endpoints.register', endpoint);

    return new Promise((resolve, reject) => {
      this.http.post(endpoint, data, headers).toPromise().then(res => {
        this.onLogin(res).then(() => {
          resolve(res);

          this.event.broadcast('auth:registered', res);
        }, error => reject(error));
      }, error => reject(error));;
    });
  }

  /**
   * Send a reset password request.
   */
  resetPassword(data: any, endpoint: string = '', headers = {}): Promise<any> {
    endpoint = this.config.get(
      'authentication.endpoints.resetPassword', endpoint
    );

    return new Promise((resolve, reject) => {
      this.http.post(endpoint, data, headers).toPromise().then(res => {
        this.onLogin(res).then(() => resolve(res))
      }, error => reject(error));
    });
  }

  /**
   * Resolve the authenticated user.
   */
  private resolveUser(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.timeouts['resolveUser'] = setTimeout(() => {
        this.getUser().subscribe((user) => {
          this.setAuthenticated(true);

          this.setUser(user.data || user).then((user) => {
            this.event.broadcast('auth:loggedIn', user);

            resolve();
          }, error => reject(error));
        }, error => reject(error));
      }, 250);
    });
  }

  /**
   * Set the unAuthenticatedHandler of the service.
   */
  setUnAuthenticatedHandler(fn: Function): void {
    this.unAuthenticatedHandler = fn;
  }

  /**
   * Set the redirect data.
   */
  setRedirect(value: any): any {
    return this.redirect = value;
  }

  /**
   * Set the current authenticated user.
   */
  setUser(user: object): Promise<any> {
    if (user) {
      user = new UserModel(this.authorization, user);
    }

    return new Promise((resolve) => resolve(this.authUser = user));
  }

  /**
   * Store aut token and broadcast an event.
   */
  private async storeToken(res: any): Promise<void> {
    try {
      await this.token.set(this.token.read(res));
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Unauthenticate the current user.
   */
  unauthenticate(): void {
    this.token.remove();
    this.setAuthenticated(false);
    this.setUser(null);
    this.authorization.clearPolicies();
  }

  /**
   * Get the current authenticated user.
   */
  user = (): any => this.authUser;
}
