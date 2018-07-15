import { Injectable, OnDestroy } from '@angular/core';
import { Config } from './../config';
import { Event } from './event';
import { Token } from './token';
import { HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable()
export class Http implements OnDestroy {
    /**
     * Create a new instance of the service.
     *
     * @param  config
     * @param  event
     * @param  token
     */
    constructor(
        public config: Config,
        public event: Event,
        public token: Token
    ) {
        this.setDefaultHeaders();
        this.eventListeners();
    }

    /**
     * Assignable base url for http calls.
     */
    baseUrl: string = '';

    /**
     * Headers to be sent with all http calls.
     */
    public headers: HttpHeaders = new HttpHeaders();

    /**
     * The subsciptions of the service.
     */
    subs: any = {};

    /**
     * On service destroy.
     */
    ngOnDestroy(): void {
        Object.keys(this.subs).forEach(k => this.subs[k].unsubscribe());
    }

    /**
     * Build url parameters for requests.
     *
     * @param  params
     */
    buildParams(params: any): HttpParams {
        var query_params = new HttpParams();

        if (params) {
            Object.keys(params).forEach((key: any) => {
                if (params[key]) query_params.set(key, params[key]);
            });
        }

        return query_params;
    }

    /**
     * Event listeners.
     */
    private eventListeners(): void {
        if (this.event) {
            let sub = () => this.setDefaultHeaders();
            this.subs['auth:loggingIn'] = this.event.listen('auth:loggingIn').subscribe(sub);
            this.subs['auth:loggedOut'] = this.event.listen('auth:loggedOut').subscribe(sub);
            this.subs['auth:check'] = this.event.listen('auth:check').subscribe(sub);
        }
    }

    /**
     * Get url for http request.
     *
     * @param  url
     */
    public getUrl(url: string): string {
        if (url.startsWith('/') || url.startsWith('http')) return url;

        let baseUrl = this.baseUrl || this.config.get('http.baseUrl') || '';

        return (baseUrl) ? baseUrl + '/' + url : url;
    }

    /**
     * Set the default headers for http request.
     */
    setDefaultHeaders(): void {
        let configHeaders = (this.config) ? this.config.get('http.headers') : null;

        if (configHeaders) {
            Object.keys(configHeaders).forEach(key => {
                this.headers = this.headers.set(key, configHeaders[key]);
            });
        }

        this.tokenHeader();
    }

    /**
     * Add a token header to the request.
     */
    tokenHeader(): Promise<any> {
        return new Promise((resolve) => {
            if (this.config && this.config.get('authentication.method.token')) {
                this.token.get().then(token => {
                    let scheme = this.config.get('token.scheme');
                    let value = (scheme) ? `${scheme} ${token}` : token;
                    this.headers = this.headers.set('Authorization', value);
                    resolve(token ? true : false);
                }, () => {
                    this.headers = this.headers.delete('Authorization');
                    resolve(false);
                });
            }
        })
    }
}
