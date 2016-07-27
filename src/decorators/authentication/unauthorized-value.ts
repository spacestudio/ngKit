import { Authentication } from '../../services';

/**
 * Value to return on a method or property when not authenticated.
 *
 * @param  {any} value
 * @return {function}
 */
export function UnauthorizedValue(value: any) {
    return function(target: any, key: string, descriptor: PropertyDescriptor) {
        if (descriptor && !Authentication.authenticated) {
            descriptor.value = () => value;
        } else if (!descriptor && !Authentication.authenticated) {
            Object.defineProperty(target, key, {
                configurable: false,
                get: () => value
            });
        }
    }
}
