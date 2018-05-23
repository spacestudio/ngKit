import { Authorization } from '../services/authorization';

export class UserModel {
    /**
     * Create a new instance of the model.
     *
     * @param authorization
     * @param user
     */
    constructor(
        private authorization: Authorization,
        public user: object
    ) {
        Object.assign(this, user);
    }

    /**
     * Check if user can perform action based on a policy.
     *
     * @param  key
     * @param  value
     */
    can(key: string, value: any): boolean {
        return this.authorization.checkPolicy(key, value);
    }

    /**
     * Check if user cannot perform action based on a policy.
     *
     * @param  key
     * @param  value
     */
    cannot(key: string, value: any): boolean {
        return !this.authorization.checkPolicy(key, value);
    }

    /**
     * Allow a user to perform action based on a policy.
     *
     * @param  policyName
     * @param  object
     * @param  allowed
     */
    allow(policyName: string, object: any, allowed: Function | boolean): UserModel {
        if (typeof allowed === 'function' && allowed()) {
            this.authorization.addPolicy(policyName, object);
        } else if (typeof allowed === 'boolean' && allowed) {
            this.authorization.addPolicy(policyName, object);
        } else {
            this.authorization.removePolicy(policyName, object);
        }

        return this;
    }

    /**
     * Don't allow a user to perform action based on a policy.
     *
     * @param  policyName
     * @param  object
     * @param  allowed
     */
    disallow(policyName: string, object: any): UserModel {
        this.authorization.removePolicy(policyName, object);

        return this;
    }

    /**
     * Identify a user with a role.
     *
     * @param role
     */
    identify(role: string): UserModel {
        this.authorization.addPolicy('roles', role);

        return this;
    }

    /**
     * Check if a user is identified as a role.
     *
     * @param  role
     */
    is(role: string): boolean {
        return this.authorization.checkPolicy('roles', role);
    }

    /**
     * Check if a user is not identified with a role.
     *
     * @param  role
     */
    isNot(role: string): boolean {
        return !this.authorization.checkPolicy('roles', role);
    }
}
