import { AuthorizationService } from '../services/authentication/authorization.service';

export class UserModel {
  /**
   * Create a new instance of the model.
   */
  constructor(
    private authorizationService: AuthorizationService,
    public user: object
  ) {
    Object.assign(this, user);
  }

  /**
   * Check if user can perform action based on a policy.
   */
  can(key: string, value: any): boolean {
    return this.authorizationService.checkPolicy(key, value);
  }

  /**
   * Check if user cannot perform action based on a policy.
   */
  cannot(key: string, value: any): boolean {
    return !this.authorizationService.checkPolicy(key, value);
  }

  /**
   * Allow a user to perform action based on a policy.
   */
  allow(
    policyName: string,
    object: any,
    allowed: Function | boolean
  ): UserModel {
    if (typeof allowed === "function" && allowed()) {
      this.authorizationService.addPolicy(policyName, object);
    } else if (typeof allowed === "boolean" && allowed) {
      this.authorizationService.addPolicy(policyName, object);
    } else {
      this.authorizationService.removePolicy(policyName, object);
    }

    return this;
  }

  /**
   * Don't allow a user to perform action based on a policy.
   */
  disallow(policyName: string, object: any): UserModel {
    this.authorizationService.removePolicy(policyName, object);

    return this;
  }

  /**
   * Identify a user with a role.
   */
  identify(role: string): UserModel {
    this.authorizationService.addPolicy("roles", role);

    return this;
  }

  /**
   * Check if a user is identified as a role.
   */
  is(role: string): boolean {
    return this.authorizationService.checkPolicy("roles", role);
  }

  /**
   * Check if a user is not identified with a role.
   */
  isNot(role: string): boolean {
    return !this.authorizationService.checkPolicy("roles", role);
  }
}
