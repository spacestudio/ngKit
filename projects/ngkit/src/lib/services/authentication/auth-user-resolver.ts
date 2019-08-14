import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Authentication } from "./authentication";
import { Observable } from "rxjs";

@Injectable()
class AuthUserResolver implements Resolve<any> {
  /**
   * Create a new instance of the service.
   */
  constructor(private auth: Authentication) { }

  /**
   * Resolve the user.
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.auth.resolveUser();
  }
}
