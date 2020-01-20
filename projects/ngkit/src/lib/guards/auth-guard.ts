import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router,
  RouterStateSnapshot
} from '@angular/router';
import { Authentication } from '../services/authentication/authentication';
import { Event } from '../services/event';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  /**
   * Create a new instance.
   */
  constructor(
    public auth: Authentication,
    public event: Event,
    public router: Router,
  ) { }

  /**
   * Determine if the user can activate a route.
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return this.guard(route, state);
  }

  /**
   * Determine if the user can activate children of a route.     *
   */
  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return this.guard(route, state);
  }

  /**
   * The method to apply to guard.
   */
  guard(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.auth.user()) {
        resolve(true);
      } else {
        this.auth.check().then(check => {
          if (check) {
            resolve(true);
          } else {
            this.auth.setRedirect(state.url);
            this.event.broadcast('auth:required').then(() => {
              this.auth.unAuthenticatedHandler(this.router);
              resolve(false);
            });
          }
        });
      }
    });
  }
}
