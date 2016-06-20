import {Observable, Subject} from 'rxjs';

export class ngKitEvent {

    /**
     * Events.
     */
    channels: Subject<any>[] = [];

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
    channel(key: string): Subject<any> {
        if (typeof this.channels[key] === 'undefined') {
            this.channels[key] = new Subject<any>();
        }

        return this.channels[key];
    }

    /**
     * Set multiple event channels.
     *
     * @param {Array} events
     */
    setChannels(channels: string[]): void {
        channels.forEach((channel) => this.channel(channel));
    }

    /**
     *  Listen on an event.
     *
     * @param  {string} key
     *
     * @return {Observable}
     */
    listen(key: string): Observable<any> {
        return this.channel(key).asObservable();
    }
}
