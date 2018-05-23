import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild } from '@angular/router';
import { Authentication } from './../services/authentication';
import { Event } from './../services/event';

@Injectable()
export class AuthResolveGuard implements CanActivate, CanActivateChild {
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
                this.auth.check().subscribe(() => {
                    resolve(true);
                });
            }
        });
    }
}
