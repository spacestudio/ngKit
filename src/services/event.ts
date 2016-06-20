import {Observable, Subject} from 'rxjs';

export class ngKitEvent {

    /**
     * Events.
     */
    events: Subject<any>[] = [];

    /**
     * Constructor.
     */
    constructor() { }

    /**
     * Get an event listener.
     *
     * @param  {string} key
     *
     * @return {Observable>}
     */
    on(key: string): Subject<any> {
        if (typeof this.events[key] === 'undefined') {
            this.events[key] = new Subject<any>();
        }

        return this.events[key];
    }

    /**
     * Set multiple events.
     *
     * @param {Array} events
     */
    setEvents(events: string[]): void {
        events.forEach((event) => this.on(event));
    }

    /**
     *  Listen on an event.
     *
     * @param  {string} key
     *
     * @return {Observable}
     */
    listen(key: string): Observable<any> {
        return this.on(key).asObservable();
    }
}
