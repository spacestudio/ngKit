import { Injectable } from '@angular/core';
import { PolicyModel } from './../models/index';

@Injectable()
export class Authorization {
    /**
     * Active Policies
     */
    policies: PolicyModel[] = [];

    /**
     * Constructor.
     */
    constructor() { }

    /**
     *  Add a policy to the service.
     *
     * @param  key
     * @param  value
     */
    addPolicy(key: string, value?: any): boolean {
        if (this.policies.findIndex(policy => policy.name == key) < 0) {
            let policy = new PolicyModel({ name: key });

            if (value) policy.objects.push(value);

            this.policies.push(policy);

            return true;
        } else {
            let index = this.policies.findIndex(policy => policy.name == key);

            if (value && !this.policies[index].objects[value]) {
                this.policies[index].objects.push(value);

                return true;
            }

            return false;
        }
    }

    /**
     * Check the given policy.
     *
     * @param  name
     * @param  value
     */
    checkPolicy(key: string, value: any = null): boolean {
        let check = false;
        let policy = this.policies.find(policy => policy.name === key);

        if (policy) {
            check = true;
        }

        if (policy && ((value && policy.objects.indexOf(value) >= 0) ||
            (!value && !policy.objects.length))) {
            check = true;
        } else {
            check = false;
        }

        return check;
    }

    /**
     * Clear all the policies on the service.
     */
    clearPolicies(): void {
        this.policies = [];
    }

    /**
     *  Remove a policy that has already been defined.
     *
     * @param  key
     * @param  value
     */
    removePolicy(key: string, value: any): boolean {
        let policy = this.policies.find(policy => policy.name === key);

        if (policy && policy.objects.indexOf(value) >= 0) {
            let index = this.policies.findIndex(policy => policy.name === name);
            let objectIndexs: any[] = [];

            policy.objects.forEach((o, i) => {
                if (o == value) {
                    objectIndexs.push(i);
                }
            });

            objectIndexs.forEach(index => delete policy.objects[index]);

            this.policies[index] = policy;

            return true;
        }

        return false;
    }
}
