import { Authentication, Event } from '../../services/index';

/**
 * AuthDisposal interface.
 */
interface AuthDisposal {
    new (...args): AuthDisposal;
}

/**
 * Value to return on a method or property when not authenticated.
 *
 * @param  {any} value
 * @return {function}
 */
export function AuthDisposal(properties: any): any {
    return (Target: AuthDisposal) => {
        return class extends Target {
            /**
             * Create new constructor.
             *
             * @param  {AuthDisposal} target
             */
            constructor(...args) {
                super(...args);

                this.dispose();
            }

            /**
             * Disposes properties from class on auth event.
             *
             * @return {void}
             */
            dispose(): void {
                let origin = {};
                Object.assign(origin, this);

                Event.channel('auth:loggedOut').asObservable().subscribe(() => {
                    properties.forEach(property => {
                        if (this[property]) {
                            this[property] = origin[property];
                        }
                    });
                });
            }
        }
    }
}
