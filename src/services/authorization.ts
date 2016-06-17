import {Injectable, EventEmitter, Output} from '@angular/core';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class Authorization {

    /**
     * Redirection event.
     *
     * @type {Subject}
     */
    private _redirect = new Subject<any>();

    /**
     * // REVIEW:
     * [asObservable description]
     *
     * @return {[type]} [description]
     */
    //redirect$ = this._redirect.asObservable();
    //
    //

    constructor() { }
}
