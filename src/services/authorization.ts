import { Injectable } from '@angular/core';
import { PolicyModel } from './../models/index';
import { Event } from './event';

@Injectable()
export class Authorization {
    /**
     * Active Policies
     *
     * @type {PolicyModel[]}
     */
    policies: PolicyModel[] = [];

    /**
     * Constructor.
     */
    constructor() { }

    /**
     *  Add a policy to the service.
     *
     * @param  {string} name
     * @param  {any} object
     * @return {boolean}
     */
    addPolicy(name: string, object?: any): boolean {
        if (this.policies.findIndex(policy => policy.name === name) < 0) {
            let policy = new PolicyModel({ name: name });

            if (object) policy.objects.push(object);

            this.policies.push(policy);

            return true;
        } else {
            let index = this.policies.findIndex(policy => policy.name === name);

            if (object && !this.policies[index].objects[object]) {
                this.policies[index].objects.push(object);

                return true;
            }

            return false;
        }
    }

    /**
     *  Remove a policy that has already been defined.
     *
     * @param  {string} name
     * @param  {any} object
     * @return {boolean}
     */
    removePolicy(name: string, object: any): boolean {
        let policy = this.policies.find(policy => policy.name === name);

        if (policy && policy.objects.indexOf(object) >= 0) {
            let index = this.policies.findIndex(policy => policy.name === name);
            let objectIndex = policy.objects.indexOf(object);

            delete policy.objects[objectIndex];

            this.policies[index] = policy;

            return true;
        }

        return false;
    }

    /**
     * Check the given policy.
     *
     * @param  {string} name
     * @param  {any} object
     * @return {boolean}
     */
    checkPolicy(name: string, object: any): boolean {
        let policy = this.policies.find(policy => policy.name === name);

        if (policy && policy.objects.indexOf(object) >= 0) {
            return true;
        }

        return false;
    }
}
