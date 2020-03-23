export abstract class AuthDriver {
  /**
   * Actions to perform on login.
   */
  abstract async onLogin(res: any): Promise<void>;

  /**
   * Actions to perform on logout.
   */
  abstract async onLogout(): Promise<void>;
}
