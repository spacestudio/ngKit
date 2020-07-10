import { AuthDriver } from './auth-driver';
import { Config } from '../../config';
import { Token } from '../token/token';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: "root"
})
export class SessionDriver extends AuthDriver {
  /**
   * Create a new intsance of the service.
   */
  constructor(private config: Config) {
    super();
  }

  /**
   * Actions to perform on login.
   */
  async onLogin(res: any): Promise<void> {

  }

  /**
   * Actions to perform on logout.
   */
  async onLogout(): Promise<void> {
    // await this.token.destroy();
  }
}
