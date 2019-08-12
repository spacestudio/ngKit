export class PolicyModel {
    /**
     * Name of the policy.
     */
    name: string;

    /**
     * The objects of the defined policy.
     */
    objects: any[] = [];

    /**
     * Constructor.
     *
     * @param  policy
     */
    constructor(policy: any) {
        Object.assign(this, policy);
    }
}
