import { AuthenticationService } from '../services/authentication/authentication.service';
import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild } from '@angular/router';

@Injectable()
export class AuthResolveGuard implements CanActivate, CanActivateChild {
  /**
   * Create a new instance.
   */
  constructor(public auth: AuthenticationService) {}

  /**
   * Determine if the user can activate a route.
   */
  canActivate(): Promise<boolean> {
    return this.guard();
  }

  /**
   * Determine if the user can activate children of a route.
   */
  canActivateChild(): Promise<boolean> {
    return this.guard();
  }

  /**
   * The method to apply to guard.
   */
  guard(): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.auth.user()) {
        resolve(true);
      } else {
        this.auth.check().then(
          () => {
            resolve(true);
          },
          () => {
            resolve(true);
          }
        );
      }
    });
  }
}
