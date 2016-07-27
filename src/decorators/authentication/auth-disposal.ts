import { Authentication } from '../../services';

/**
 * Value to return on a method or property when not authenticated.
 *
 * @param  {any} value
 * @return {function}
 */
export function AuthDisposal(properties: any) {
    if (!Authentication.authenticated) {
        return function(target) {

            target.prototype.dispose = function() {
                Object.keys(properties).forEach(property => {
                    if (this[property]) {
                        this[property] = properties[property];
                    }
                });
            }

            return target;
        };
    }
}
