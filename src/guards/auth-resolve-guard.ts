import { Injectable, OnDestroy } from '@angular/core';
import { CanActivate, CanActivateChild } from '@angular/router';
import { Authentication } from './../services/authentication';
import { Event } from './../services/event';

@Injectable()
export class AuthResolveGuard implements CanActivate, CanActivateChild, OnDestroy {
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
                this.subs['auth:check'] = this.auth.check().subscribe(() => {
                    resolve(true);
                });
            }
        });
    }
}
