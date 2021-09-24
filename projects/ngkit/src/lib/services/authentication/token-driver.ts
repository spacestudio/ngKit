import { AuthDriver } from './auth-driver';
import { ConfigSerivce } from '../../config.service';
import { TokenService } from '../token/token.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: "root",
})
export class TokenDriver extends AuthDriver {
  /**
   * Create a new intsance of the service.
   */
  constructor(
    private config: ConfigSerivce,
    private tokenService: TokenService
  ) {
    super();
  }

  /**
   * Get the authentication token.
   */
  async getToken(tokenName: string = null): Promise<any> {
    return await this.tokenService.get(tokenName);
  }

  /**
   * Actions to perform on login.
   */
  async onLogin(res: any): Promise<void> {
    await this.storeToken(res, this.config.get("token.access"), "_token");
    await this.storeToken(
      res,
      this.config.get("token.refresh"),
      "_refresh_token"
    );
  }

  /**
   * Actions to perform on logout.
   */
  async onLogout(): Promise<void> {
    await this.tokenService.destroy();
  }

  /**
   * Store auth tokens from the response.
   */
  async storeToken(
    res: any,
    key: string = null,
    tokenName: string = null
  ): Promise<void> {
    try {
      const token = this.tokenService.read(res, key);

      if (token) {
        const storageType = this.config.get("authentication.shouldRemember")
          ? "local"
          : "session";
        await this.tokenService.set(token, tokenName, storageType);
      }
    } catch (error) {
      throw error;
    }
  }
}
