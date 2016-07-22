import { Authorization } from './../services/authorization';
import { Injectable } from '@angular/core';

@Injectable()
export class UserModel {
    /**
     * Constructor.
     */
    constructor(
        private authorization: Authorization,
        public user
    ) {
        Object.assign(this, user);
    }

    /**
     * Check if user can perform action based on a policy.
     *
     * @param  {string}  policyName
     * @param  {any}  object
     * @return {boolean}
     */
    can(policyName: string, object: any): boolean {

        return this.authorization.checkPolicy(policyName, object);
    }
    /**
     * Check if user cannot perform action based on a policy.
     *
     * @param  {string}  policyName
     * @param  {any}  object
     * @return {boolean}
     */
    cannot(policyName: string, object: any): boolean {
        return !this.authorization.checkPolicy(policyName, object);
    }

    /**
     * Allow a user to perform action based on a policy.
     *
     * @param  {string}  policyName
     * @param  {any}  object
     * @param  {boolean} allowed
     * @return {boolean}
     */
    allow(policyName: string, object: any, allowed: Function | boolean): UserModel {
        if (allowed instanceof Function && allowed()) {
            this.authorization.addPolicy(policyName, object);
        } else if (allowed instanceof Boolean && allowed) {
            this.authorization.addPolicy(policyName, object);
        }

        return this;
    }
}
