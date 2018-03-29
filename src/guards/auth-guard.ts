import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot
} from '@angular/router';
import { Authentication } from './../services/authentication';
import { Event } from './../services/event';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
    /**
     * Create a new instance.
     *
     * @param  {Authentication} auth
     * @param  {Event} event
     */
    constructor(
        public auth: Authentication,
        public event: Event
    ) { }

    /**
     * Determine if the user can activate a route.
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state     *
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        return this.guard(route, state);
    }

    /**
     * Determine if the user can activate children of a route.
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state     *
     */
    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        return this.guard(route, state);
    }

    /**
     * The method to apply to guard.
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @return {Promise<boolean>}
     */
    guard(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        route;

        return new Promise((resolve) => {
            if (this.auth.user()) {
                resolve(true);
            } else {
                this.auth.check().subscribe(check => {
                    if (check) {
                        resolve(true);
                    } else {
                        this.event.broadcast('auth:modal');

                        this.auth.setRedirect(state.url);

                        resolve(false);
                    }
                });
            }
        });
    }
}
