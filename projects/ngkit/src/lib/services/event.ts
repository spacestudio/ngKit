import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class Event {
    /**
     * Event channels.
     */
    static channels: Subject<any>[] = [];

    /**
     * Get an event listener.
     *
     * @param  key
     */
    static channel(key: any): Subject<any> {
        if (typeof Event.channels[key] === 'undefined') {
            Event.channels[key] = new Subject<any>();
        }

        return Event.channels[key];
    }

    /**
     * Set multiple event channels.
     *
     * @param events
     */
    setChannels(channels: string[]): void {
        channels.forEach((channel) => Event.channel(channel));
    }

    /**
     * Broadcast an event to a channel.
     */
    broadcast(key: string, data = {}): Promise<any> {
        return Promise.resolve(Event.channel(key).next(data));
    }

    /**
     *  Listen on a channel for an event.s
     *
     * @param  key
     */
    listen(key: string): Observable<any> {
        return Event.channel(key).asObservable();
    }
}
