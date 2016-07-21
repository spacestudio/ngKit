export class PolicyModel {
    /**
     * Name of the policy.
     *
     * @type {string}
     */
    name: string;

    /**
     * The value of the defined policy.
     *
     * @type {boolean}
     */
    value: boolean;

    /**
     * Constructor.
     *
     * @param  {any} policy
     */
    constructor(policy: any) {
        Object.assign(this, policy);
    }
}
