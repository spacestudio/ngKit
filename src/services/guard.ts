import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Authentication } from './authentication';

@Injectable()
export class AuthGuard implements CanActivate {
    /**
     * Determine if the user can activate a route.
     *
     * @return {boolean}
     */
    canActivate() {
        return Authentication.authenticated;
    }
}
