import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class EventService {
  /**
   * Event channels.
   */
  static channels: Subject<any>[] = [];

  /**
   * Get an event listener.
   */
  static channel(key: any): Subject<any> {
    if (typeof EventService.channels[key] === "undefined") {
      EventService.channels[key] = new Subject<any>();
    }

    return EventService.channels[key];
  }

  /**
   * Set multiple event channels.
   */
  setChannels(channels: string[]): void {
    channels.forEach((channel) => EventService.channel(channel));
  }

  /**
   * Broadcast an event to a channel.
   */
  broadcast(key: string, data = {}): Promise<any> {
    return Promise.resolve(EventService.channel(key).next(data));
  }

  /**
   *  Listen on a channel for an event.s
   */
  listen(key: string): Observable<any> {
    return EventService.channel(key).asObservable();
  }
}
