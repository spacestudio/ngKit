import { AuthDriver } from "./auth-driver";
import { Token } from "../token/token";
import { Injectable } from "@angular/core";
import { Config } from "../../config";

@Injectable({
  providedIn: "root"
})
export class TokenDriver extends AuthDriver {
  /**
   * Create a new intsance of the service.
   */
  constructor(private config: Config, private token: Token) {
    super();
  }

  /**
   * Get the authentication token.
   */
  async getToken(tokenName: string = null): Promise<any> {
    return await this.token.get(tokenName);
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
    await this.token.destroy();
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
      const token = this.token.read(res, key);

      if (token) {
        const storageType = this.config.get("authentication.shouldRemember")
          ? "local"
          : "session";
        await this.token.set(token, tokenName, storageType);
      }
    } catch (error) {
      throw error;
    }
  }
}
