import { AuthDriver } from './auth-driver';
import { ConfigSerivce } from '../../config.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: "root",
})
export class SessionDriver extends AuthDriver {
  /**
   * Create a new intsance of the service.
   */
  constructor(private config: ConfigSerivce) {
    super();
  }

  /**
   * Actions to perform on login.
   */
  async onLogin(res: any): Promise<void> {}

  /**
   * Actions to perform on logout.
   */
  async onLogout(): Promise<void> {
    // await this.token.destroy();
  }
}
