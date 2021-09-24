import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class EventSerivce {
  /**
   * Event channels.
   */
  static channels: Subject<any>[] = [];

  /**
   * Get an event listener.
   */
  static channel(key: any): Subject<any> {
    if (typeof EventSerivce.channels[key] === "undefined") {
      EventSerivce.channels[key] = new Subject<any>();
    }

    return EventSerivce.channels[key];
  }

  /**
   * Set multiple event channels.
   */
  setChannels(channels: string[]): void {
    channels.forEach((channel) => EventSerivce.channel(channel));
  }

  /**
   * Broadcast an event to a channel.
   */
  broadcast(key: string, data = {}): Promise<any> {
    return Promise.resolve(EventSerivce.channel(key).next(data));
  }

  /**
   *  Listen on a channel for an event.s
   */
  listen(key: string): Observable<any> {
    return EventSerivce.channel(key).asObservable();
  }
}
