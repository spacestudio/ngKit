import {Observable, Subject} from 'rxjs';

export class ngKitEvent {

    /**
     * Event channels.
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
     * Broadcast an event to a channel.
     *
     * @return {void}
     */
    broadcast(key: string, data = {}): void {
        this.channel(key).next(data)
    }

    /**
     *  Listen on a channel for an event.
     *
     * @param  {string} key
     * @return {Observable}
     */
    listen(key: string): Observable<any> {
        return this.channel(key).asObservable();
    }
}
