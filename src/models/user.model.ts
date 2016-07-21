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
     * @return {boolean}
     */
    can(policyName: string): boolean {
        return this.authorization.checkPolicy(policyName);
    }
}
