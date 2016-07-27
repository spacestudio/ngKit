import { Authentication } from '../../services';

/**
 * Value to return on a method or property when not authenticated.
 *
 * @param  {any} value
 * @return {function}
 */
function AuthDisposal(properties: any) {
    if (!Authentication.authenticated) {
        return (target) => {
            function construct(constructor, args) {
                let c: any = function() {
                    return constructor.apply(this, args);
                }

                c.prototype = constructor.prototype;

                return new c();
            }

            var f: any = function(...args) {
                target.prototype.dispose = function() {
                    Object.keys(properties).forEach(property => {
                        if (this[property]) {
                            this[property] = properties[property];
                        }
                    });

                    return true;
                };

                return construct(target, args);
            }

            f.prototype = target.prototype;

            return f;
        };
    }
}
