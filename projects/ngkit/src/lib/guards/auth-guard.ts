import { Injectable, OnDestroy } from '@angular/core';
import {
  ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router,
  RouterStateSnapshot
} from '@angular/router';
import { Authentication } from '../services/authentication/authentication';
import { Event } from '../services/event';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild, OnDestroy {
  /**
   * Create a new instance.
   */
  constructor(
    public auth: Authentication,
    public event: Event,
    public router: Router,
  ) { }

  /**
   * The subsciptions of the service.
   */
  subs: any = {};

  /**
   * On service destroy.
   */
  ngOnDestroy(): void {
    Object.keys(this.subs).forEach(k => this.subs[k].unsubscribe());
  }

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
        this.subs['auth:check'] = this.auth.check().subscribe(check => {
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
