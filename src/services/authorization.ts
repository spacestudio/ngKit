import { Injectable } from '@angular/core';
import { PolicyModel } from './../models';
import { Event } from './event';

@Injectable()
export class Authorization {
    /**
     * Active Policies
     *
     * @type {PolicyModel[]}
     */
    policies: PolicyModel[];

    /**
     * Constructor.
     */
    constructor() { }

    /**
     *  Add a policy to the service.
     *
     * @param  {string} name
     * @param  {boolean} value
     * @return {boolean}
     */
    addPolicy(name: string, value: boolean): boolean {
        let policy = new PolicyModel({ name: name });

        if (!this.policies.find(policy => policy.name === name)) {
            this.policies.push(policy);

            return true;
        }

        return false;
    }

    /**
     *  Update a policy that has already been defined.
     *
     * @param  {string} name
     * @param  {boolean} value
     * @return {boolean}
     */
    updatePolicy(name: string, value: boolean): boolean {
        let policy = this.policies.find(policy => policy.name === name);

        if (policy) {
            let index = this.policies.findIndex(policy => policy.name === name);
            this.policies[index].value = value;

            return true;
        }

        return false;
    }

    /**
     * Check the given policy.
     *
     * @param  {string} name
     * @return {boolean}
     */
    checkPolicy(name: string): boolean {
        let policy = this.policies.find(policy => policy.name === name);

        if (policy) {
            return policy.value;
        }

        return false;
    }
}
