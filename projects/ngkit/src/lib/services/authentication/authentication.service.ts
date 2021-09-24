import { AuthDriver } from './auth-driver';
import { AuthorizationService } from './authorization.service';
import { SessionDriver } from './session-driver';
import { TokenDriver } from './token-driver';
import { ConfigSerivce } from '../../config.service';
import { UserModel } from '../../models/user';
import { EventService } from '../event.service';
import { HttpService } from '../http.service';
import { StorageService } from '../storage/storage.service';
import { TokenService } from '../token/token.service';
import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';

@Injectable({
  providedIn: "root",
})
export class AuthenticationService implements OnDestroy {
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
    "auth:expired",
    "auth:login",
    "auth:logginIn",
    "auth:loggedIn",
    "auth:logout",
    "auth:loggingOut",
    "auth:loggedOut",
    "auth:required",
    "auth:check",
    "auth:guarded",
    "auth:registered",
    "auth:updated",
  ];

  /**
   * An active instance of the auth check promise.
   */
  checkPromise: Promise<boolean>;

  /**
   * The driver instance of the service.
   */
  driver: AuthDriver;

  /**
   * The redirect data on the service.
   */
  private redirect: any = null;

  /**
   * The subsciptions of the service.
   */
  protected subs: any = {};

  /**
   * The unauthenticated handler of the service.
   */
  unAuthenticatedHandler: Function = () => {};

  /**
   * Create a new instance of the service.
   */
  constructor(
    public authorizationService: AuthorizationService,
    public config: ConfigSerivce,
    public eventService: EventService,
    public http: HttpClient,
    public httpService: HttpService,
    public storageService: StorageService,
    public tokenService: TokenService
  ) {
    this.init();
  }

  /**
   * On service destroy.
   */
  ngOnDestroy(): void {
    Object.keys(this.subs).forEach((k) => this.subs[k].unsubscribe());
  }

  /**
   * Check if user is logged in.
   */
  async check(
    force: boolean = false,
    endpoint: string = null
  ): Promise<boolean> {
    endpoint = this.config.get("authentication.endpoints.check", endpoint);

    if (this.checkPromise) {
      return this.checkPromise;
    }

    return (this.checkPromise = new Promise(async (resolve) => {
      this.eventService.broadcast("auth:check");

      if (this.authenticated === false) {
        return this.checkResolve(resolve, false);
      }

      if (this.authenticated === true && !force) {
        this.eventService.broadcast("auth:loggedIn", this.user());

        return this.checkResolve(resolve, true);
      }

      const loggedIn = await this.storageService.get("logged_in");

      if (!loggedIn) {
        return this.checkResolve(resolve, false);
      }

      try {
        const res: any = await this.getUser(endpoint);
        this.setAuthenticated(true);
        this.setUser(res.data || res);
        await this.eventService.broadcast("auth:loggedIn", this.user());

        return this.checkResolve(resolve, true);
      } catch (error) {
        this.setAuthenticated(false);
        await this.eventService.broadcast("auth:required", true);

        return this.checkResolve(resolve, false);
      }
    }));
  }

  /**
   * Resolve the auth check.
   */
  private async checkResolve(
    resolve: Function,
    authenticated: boolean
  ): Promise<void> {
    await this.eventService.broadcast("auth:check", authenticated);
    this.checkPromise = null;
    this.storageService.set("logged_in", authenticated);
    resolve(authenticated);
  }

  /**
   * The service event listeners.
   */
  private eventListeners(): void {
    this.subs["auth:loggedIn"] = this.eventService
      .listen("auth:loggedIn")
      .subscribe((user) => {
        this.setAuthenticated(true);
        this.setUser(user);
      });
  }

  /**
   * Send a forgot password request.
   */
  forgotPassword(data: any, endpoint: string = "", headers = {}): Promise<any> {
    endpoint = this.config.get(
      "authentication.endpoints.forgotPassword",
      endpoint
    );

    return new Promise((resolve, reject) => {
      return this.http
        .post(endpoint, data, headers)
        .toPromise()
        .then(
          (res) => resolve(res),
          (error) => reject(error)
        );
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
    return await this.tokenService.get(tokenName);
  }

  /**
   * Get the current authenticated user.
   */
  private async getUser(endpoint: string = ""): Promise<any> {
    endpoint = this.config.get("authentication.endpoints.getUser", endpoint);

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
   * Initialize the service.
   */
  async init(): Promise<void> {
    this.setDriver();
    this.eventService.setChannels(this.channels);
    this.eventListeners();

    const shouldRemember = new Boolean(
      await this.storageService.get("remember")
    ).valueOf();
    this.remember(shouldRemember);
  }

  /**
   * Set if authenticated value.
   */
  setAuthenticated(value: boolean): boolean {
    return (this.authenticated = value);
  }

  /**
   * Send a login request.
   */
  async login(
    credentials: any,
    endpoint: string = "",
    headers = {}
  ): Promise<any> {
    endpoint = this.config.get("authentication.endpoints.login", endpoint);
    const res = await this.http
      .post(endpoint, credentials, headers)
      .toPromise();
    await this.onLogin(res);
  }

  /**
   * Send a request to log the authenticated user out.
   */
  async logout(endpoint: string = "", headers = {}): Promise<boolean> {
    await this.eventService.broadcast("auth:loggingOut");
    endpoint = this.config.get("authentication.endpoints.logout", endpoint);

    if (!endpoint) {
      await this.onLogout();

      return true;
    }

    try {
      await this.http.post(endpoint, {}, headers).toPromise();
      return true;
    } catch (error) {
      if (error.status !== 401) {
        throw error;
      }
    } finally {
      await this.onLogout();
    }

    return true;
  }

  /**
   * Actions to perform on login.
   */
  private async onLogin(res: object): Promise<void> {
    await this.eventService.broadcast("auth:loggingIn", res);
    await this.driver.onLogin(res);
    await this.eventService.broadcast("auth:updated");
    await this.resolveUser();
    await this.storageService.set("logged_in", true);
  }

  /**
   * Actions to perform on logout.
   */
  private async onLogout(): Promise<void> {
    await this.driver.onLogout();
    await this.unauthenticate();
    await this.eventService.broadcast("auth:loggedOut");
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
   * Send a refreh request.
   */
  async refresh(
    credentials: any,
    endpoint: string = "",
    headers = {}
  ): Promise<boolean> {
    endpoint = this.config.get("authentication.endpoints.refresh", endpoint);
    const res = await this.http
      .post(endpoint, credentials, headers)
      .toPromise();
    await this.onLogin(res);

    return true;
  }

  /**
   * Send a register request.
   */
  async register(
    data: object,
    endpoint: string = "",
    headers = {}
  ): Promise<any> {
    endpoint = this.config.get("authentication.endpoints.register", endpoint);

    try {
      const res = await this.http.post(endpoint, data, headers).toPromise();
      await this.onLogin(res);
      await this.eventService.broadcast("auth:registered", res);
      return res;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Set the state of the should remember property.
   */
  async remember(shouldRemember: boolean): Promise<AuthenticationService> {
    this.config.set("authentication.shouldRemember", shouldRemember);
    await this.storageService.set("remember", shouldRemember);

    return this;
  }

  /**
   * Send a reset password request.
   */
  resetPassword(data: any, endpoint: string = "", headers = {}): Promise<any> {
    endpoint = this.config.get(
      "authentication.endpoints.resetPassword",
      endpoint
    );

    return new Promise((resolve, reject) => {
      this.http
        .post(endpoint, data, headers)
        .toPromise()
        .then(
          (res) => {
            if (this.driver instanceof TokenDriver) {
              this.onLogin(res).then(() => resolve(res));
            } else {
              resolve(res);
            }
          },
          (error) => reject(error)
        );
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
      this.eventService.broadcast("auth:loggedIn", user);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Set the driver.
   */
  setDriver(name: string = ""): void {
    const driver = this.config.get("authentication.driver", name);

    if (driver === "token") {
      this.driver = new TokenDriver(this.config, this.tokenService);
      return;
    }

    this.driver = new SessionDriver(this.config);
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
    return (this.redirect = value);
  }

  /**
   * Set the current authenticated user.
   */
  setUser(user: object): Promise<any> {
    if (user) {
      user = new UserModel(this.authorizationService, user);
    }

    return new Promise((resolve) => resolve((this.authUser = user)));
  }

  /**
   * Unauthenticate the current user.
   */
  async unauthenticate(): Promise<void> {
    this.setAuthenticated(false);
    await this.setUser(null);
    this.authorizationService.clearPolicies();
    await this.remember(true);
    await this.storageService.remove("logged_in");
    await this.storageService.remove("remember");
  }

  /**
   * Get the current authenticated user.
   */
  user = (): any => this.authUser;
}
