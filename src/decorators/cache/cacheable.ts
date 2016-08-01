import { Cache } from '../../services/index';

/**
 * Cacheable interface.
 */
interface Cacheable {
    new (...args): Cacheable;
}

/**
 * Value to return on a method or property when not authenticated.
 *
 * @param  {any} value
 * @return {function}
 */
export function Cacheable(properties: any): any {
    return (target: Cacheable) => {
        return class extends target {
            /**
             * Create new constructor.
             *
             * @param  {any} target
             */
            constructor(target) {
                super(target);
                //this.cache();
            }

            /**
             * Cache the set properties.
             *
             * @return {void}
             */
            cache(): void {
                properties.forEach(property => {
                    let params = property.split(':');
                    Cache.setItem(params[0], this[params[0]], params[1]);
                });
            }
        }
    }
}
