import { AuthenticationService } from '../services/authentication/authentication.service';
import { EventSerivce } from '../services/event.service';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
} from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate, CanActivateChild {
  /**
   * Create a new instance.
   */
  constructor(
    public auth: AuthenticationService,
    public eventService: EventSerivce,
    public router: Router
  ) {}

  /**
   * Determine if the user can activate a route.
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    return this.guard(route, state);
  }

  /**
   * Determine if the user can activate children of a route.     *
   */
  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    return this.guard(route, state);
  }

  /**
   * The method to apply to guard.
   */
  guard(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.auth.user()) {
        resolve(true);
      } else {
        this.auth.check().then((check) => {
          if (check) {
            resolve(true);
          } else {
            this.auth.setRedirect(state.url);
            this.eventService.broadcast("auth:required").then(() => {
              this.auth.unAuthenticatedHandler(this.router);
              resolve(false);
            });
          }
        });
      }
    });
  }
}
