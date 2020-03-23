import { AuthDriver } from "./auth-driver";
import { Token } from "../token/token";
import { Injectable } from "@angular/core";
import { Config } from "../../config";

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
    // await this.storeToken(res, this.config.get("token.access"), "_token");
    // await this.storeToken(
    //   res,
    //   this.config.get("token.refresh"),
    //   "_refresh_token"
    // );
  }

  /**
   * Actions to perform on logout.
   */
  async onLogout(): Promise<void> {
    // await this.token.destroy();
  }
}
