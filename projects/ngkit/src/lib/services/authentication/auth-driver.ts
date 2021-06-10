export abstract class AuthDriver {
  /**
   * Actions to perform on login.
   */
  abstract onLogin(res: any): Promise<void>;

  /**
   * Actions to perform on logout.
   */
  abstract onLogout(): Promise<void>;
}
