import { Authentication, Event } from '../../services';

/**
 * AuthDisposal interface.
 */
export interface AuthDisposal {
    dispose(): void;
}

/**
 * Value to return on a method or property when not authenticated.
 *
 * @param  {any} value
 * @return {function}
 */
export function AuthDisposal(properties: any) {
    return function(target) {
        target.prototype.dispose = function() {
            let dispose = function() {
                let origin = {};
                Object.assign(origin, this);

                Event.channel('auth:loggedOut').asObservable().subscribe(() => {
                    properties.forEach(property => {
                        if (this[property]) {
                            this[property] = origin[property];
                        }
                    });
                });
            }.bind(this)

            return dispose();
        };

        return target;
    };
}
