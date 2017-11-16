import { Injectable } from '@angular/core';
import { Config } from './../config';
import { Event } from './event';
import { Token } from './token';
import { HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable()
export class Http {
    /**
     * Assignable base url for http calls.
     *
     * @type {string}
     */
    baseUrl: string = '';

    /**
     * Headers to be sent with all http calls.
     *
     * @type {HttpHeaders}
     */
    public headers: HttpHeaders = new HttpHeaders();

    /**
     * Create a new instance of the service.
     *
     * @param  {Config} config
     * @param  {Event} eventc
     * @param  {Token} token
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
     * Build url parameters for requests.
     *
     * @param  {object} params
     * @return {HttpParams}
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
     *
     * @return {void}
     */
    private eventListeners(): void {
        if (this.event) {
            let sub = () => this.setDefaultHeaders();
            this.event.listen('auth:loggingIn').subscribe(sub);
            this.event.listen('auth:loggedOut').subscribe(sub);
            this.event.listen('auth:check').subscribe(sub);
        }
    }

    /**
     * Get url for http request.
     *
     * @param  {string} url
     * @return {string}
     */
    public getUrl(url: string): string {
        let baseUrl = this.baseUrl || this.config.get('http.baseUrl') || '';

        return (baseUrl) ? baseUrl + '/' + url : url;
    }

    /**
     * Set the default headers for http request.
     *
     * @return {void}
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
    tokenHeader(): void {
        if (this.config && this.config.get('authentication.method.token')) {
            this.token.get().then(token => {
                let scheme = this.config.get('token.scheme');
                let value = (scheme) ? `${scheme} ${token}` : token;
                this.headers = this.headers.set('Authorization', value);
            }, () => {
                this.headers = this.headers.delete('Authorization');
            });
        }
    }

    /**
     * Perform a file upload via POST.
     *
     * @param  {string} url
     * @param  {File[]} files
     * @param  {object} options
     * @return {Observable}
     */
    // postFile(url: string, files: any[], options = {}): Observable<any> {
    //     let defaultOptions = { inputName: 'file[]' };
    //     let fileOptions = Object.assign(defaultOptions, options);
    //
    //     return Observable.create((observer: Observer<any>) => {
    //         let formData: FormData = new FormData();
    //         let xhr: XMLHttpRequest = new XMLHttpRequest();
    //
    //         if (typeof files == 'object') {
    //             files = Object.keys(files).map((key: any) => files[key]);
    //         }
    //
    //         if (Array.isArray(files)) {
    //             files.forEach((file) => {
    //                 formData.append(fileOptions.inputName, file, file.name)
    //             });
    //         }
    //
    //         xhr.onreadystatechange = () => {
    //             if (xhr.readyState === 4) {
    //                 if (xhr.status === 200) {
    //                     observer.next(JSON.parse(xhr.response));
    //                     observer.complete();
    //                 } else {
    //                     observer.error(xhr.response);
    //                 }
    //             }
    //         };
    //
    //         // TODO: Add Progress
    //         // xhr.upload.onprogress = (event) => {
    //         //     this.progress = Math.round(event.loaded / event.total * 100);
    //         //
    //         //     this.progressObserver.next(this.progress);
    //         // };
    //
    //         xhr.open('POST', this.getLocation(url), true);
    //
    //         this.headers.keys().forEach((header: string) => {
    //             if (header.toLowerCase() != 'content-type') {
    //                 xhr.setRequestHeader(header, this.headers.get(header));
    //             }
    //         });
    //
    //         xhr.send(formData);
    //     });
    // }
}
