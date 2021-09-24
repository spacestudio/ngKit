import { AuthenticationService } from './authentication.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";

@Injectable()
class AuthUserResolver implements Resolve<any> {
  /**
   * Create a new instance of the service.
   */
  constructor(private auth: AuthenticationService) {}

  /**
   * Resolve the user.
   */
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.auth.resolveUser();
  }
}
