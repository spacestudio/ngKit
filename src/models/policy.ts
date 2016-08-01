export class PolicyModel {
    /**
     * Name of the policy.
     *
     * @type {string}
     */
    name: string;

    /**
     * The objects of the defined policy.
     *
     * @type {any[]}
     */
    objects: any[] = [];

    /**
     * Constructor.
     *
     * @param  {any} policy
     */
    constructor(policy: any) {
        Object.assign(this, policy);
    }
}
