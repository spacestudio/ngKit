import { HttpClient } from '@angular/common/http';
import { Http } from '../http';
import { Authorization } from './authorization';
import { Injectable, OnDestroy } from '@angular/core';
import { UserModel } from '../../models/user';
import { Config } from '../../config';
import { Token } from '../token/token';
import { Event } from '../event';
import { LocalStorage } from '../storage/local';

@Injectable({
  providedIn: 'root',
})
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
    public localStorage: LocalStorage,
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
   * An active instance of the auth check promise.
   */
  checkPromise: Promise<boolean>;

  /**
   * The redirect data on the service.
   */
  private redirect: any = null

  /**
   * The subsciptions of the service.
   */
  protected subs: any = {};

  /**
   * The unauthenticated handler of the service.
   */
  unAuthenticatedHandler: Function = () => { };

  /**
   * On service destroy.
   */
  ngOnDestroy(): void {
    Object.keys(this.subs).forEach(k => this.subs[k].unsubscribe());
  }

  /**
   * Check if user is logged in.
   */
  async check(force: boolean = false, endpoint: string = null): Promise<boolean> {
    endpoint = this.config.get('authentication.endpoints.check', endpoint);

    if (this.checkPromise) {
      return this.checkPromise;
    }

    return this.checkPromise = new Promise(async (resolve) => {
      this.event.broadcast('auth:check');

      if (this.authenticated === false) {
        return this.checkResolve(resolve, false);
      }

      if (this.authenticated === true && !force) {
        this.event.broadcast('auth:loggedIn', this.user());

        return this.checkResolve(resolve, true);
      }

      const token = await this.httpService.tokenHeader();

      if (token) {
        try {
          const res: any = await this.getUser(endpoint);
          this.setAuthenticated(true);
          this.setUser(res.data || res);
          await this.event.broadcast('auth:loggedIn', this.user());

          return this.checkResolve(resolve, true);
        } catch (error) {
          this.setAuthenticated(false);
          await this.event.broadcast('auth:required', true);

          return this.checkResolve(resolve, false);
        }
      }

      this.setAuthenticated(false);

      return this.checkResolve(resolve, false);
    });
  }

  /**
   * Resolve the auth check.
   */
  private async checkResolve(resolve: Function, authenticated: boolean): Promise<void> {
    await this.event.broadcast('auth:check', authenticated);
    this.checkPromise = null;
    this.localStorage.set('logged_in', authenticated);
    resolve(authenticated);
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
  async getToken(tokenName: string = null): Promise<any> {
    return await this.token.get(tokenName);
  }

  /**
   * Get the current authenticated user.
   */
  private async getUser(endpoint: string = ''): Promise<any> {
    endpoint = this.config.get('authentication.endpoints.getUser', endpoint);

    if (this.httpService.settingCredentials) {
      await this.httpService.settingCredentials;
    }

    return this.http.get(endpoint).toPromise();
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
  async login(credentials: any, endpoint: string = '', headers = {}): Promise<any> {
    endpoint = this.config.get('authentication.endpoints.login', endpoint);
    const res = await this.http.post(endpoint, credentials, headers).toPromise();
    await this.onLogin(res);
  }

  /**
   * Send a request to log the authenticated user out.
   */
  async logout(endpoint: string = '', headers = {}): Promise<boolean> {
    await this.event.broadcast('auth:loggingOut');
    endpoint = this.config.get('authentication.endpoints.logout', endpoint);

    if (!endpoint) {
      await this.onLogout();

      return true;
    }

    try {
      await this.http.post(endpoint, {}, headers).toPromise();
      await this.onLogout();

      return true;
    } catch (error) {
      if (error.status !== 401) {
        throw error;
      }
    }

    return true;
  }

  /**
   * Actions to perform on login.
   */
  private async onLogin(res: object): Promise<void> {
    await this.storeToken(res, this.config.get('token.access'), '_token');
    await this.storeToken(res, this.config.get('token.refresh'), '_refresh_token');
    await this.event.broadcast('auth:loggingIn', res);
    await this.resolveUser();
    await this.localStorage.set('logged_in', true);
  }

  /**
   * Actions to perform on logout.
   */
  private async onLogout(): Promise<void> {
    await this.unauthenticate();
    await this.event.broadcast('auth:loggedOut');
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
   * Send a refreh token request.
   */
  async refreshToken(credentials: any, endpoint: string = '', headers = {}): Promise<boolean> {
    endpoint = this.config.get('authentication.endpoints.refresh', endpoint);
    const res = await this.http.post(endpoint, credentials, headers).toPromise()
    await this.onLogin(res);

    return true;
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
   * Set the state of the should remember property.
   *z
   * @param shouldRemember
   */
  remember(shouldRemember: boolean): Authentication {
    this.config.set('authentication.shouldRemember', shouldRemember);

    return this;
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
  async resolveUser(): Promise<any> {
    try {
      const res = await this.getUser();
      this.setAuthenticated(true);
      const user = await this.setUser(res.data || res);
      this.event.broadcast('auth:loggedIn', user);
    } catch (error) {
      throw error;
    }
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
   * Store auth tokens from the response.
   */
  async storeToken(res: any, key: string = null, tokenName: string = null): Promise<void> {
    try {
      const token = this.token.read(res, key);

      if (token) {
        const storageType = this.config.get('authentication.shouldRemember') ? 'local' : 'session';
        await this.token.set(token, tokenName, storageType);
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Unauthenticate the current user.
   */
  async unauthenticate(): Promise<void> {
    await this.token.destroy();
    this.setAuthenticated(false);
    await this.setUser(null);
    this.authorization.clearPolicies();
    await this.remember(true);
    await this.localStorage.remove('logged_in');
  }

  /**
   * Get the current authenticated user.
   */
  user = (): any => this.authUser;
}
