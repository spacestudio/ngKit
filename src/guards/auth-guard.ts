import { Injectable, OnDestroy } from '@angular/core';
import {
    ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot
} from '@angular/router';
import { Authentication } from './../services/authentication';
import { Event } from './../services/event';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild, OnDestroy {
    /**
     * Create a new instance.
     *
     * @param  auth
     * @param  event
     */
    constructor(
        public auth: Authentication,
        public event: Event
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
     *
     * @param route
     * @param state
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        return this.guard(route, state);
    }

    /**
     * Determine if the user can activate children of a route.
     *
     * @param  route
     * @param  state     *
     */
    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        return this.guard(route, state);
    }

    /**
     * The method to apply to guard.
     *
     * @param route
     * @param state
     */
    guard(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        route;

        return new Promise((resolve) => {
            if (this.auth.user()) {
                resolve(true);
            } else {
                this.subs['auth:check'] = this.auth.check().subscribe(check => {
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
