import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Authentication } from  './authentication';
import { Config } from './../config';
import { Http } from './http';
import { Token } from './token';
import { Event } from './event';

declare let FB: any;

@Injectable()
export class FacebookAuthentication extends Authentication {
    /**
     * Facebook sdk.
     *
     * @type {any}
     */
    facebook: any;

    /**
     * Constructor.
     */
    constructor(
        public config: Config,
        public event: Event,
        public http: Http,
        public token: Token
    ) {
        super(config, event, http, token);
    }

    /**
     * Init Facebook Web SDK.
     *
     * @return {void}
     */
    init(): void {
        window['fbAsyncInit'] = () => {
            FB.init({
                appId: this.config.get('authentication.social.facebook.appId'),
                xfbml: this.config.get('authentication.social.facebook.xfbml'),
                version: this.config.get('authentication.social.facebook.version')
            });

            this.facebook = FB;
        };

        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) { return; }
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        } (document, 'script', 'facebook-jssdk'));
    }

    /**
     * Login via Facebook.
     *
     * @return {promise}
     */
    login(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.facebook.login((res) => {
                if (res.status == 'connected') {
                    this.handleLoginSuccess(res).then((res) => {
                        this.onLogin(res).then(() => resolve(res));
                    }, (error) => reject(this.handleLoginError(error)))
                } else {
                    reject('Facebook login failed.')
                }
            }, { scope: this.config.get('authentication.social.facebook.scope') });
        });
    }

    /**
     * Handle succesful Facebook login.
     *
     * @param  {object} res
     * @return {Promise}
     */
    handleLoginSuccess(res): Promise<any> {
        return new Promise((resolve, reject) => {
            this.token.set(res.authResponse.accessToken, 'facebook_access_token');
            this.updateLogingDetails({ method: 'facebook' });

            this.http.post(
                this.config.get('authentication.endpoints.socialAuth'),
                res.authResponse
            ).subscribe(res => resolve(res), error => reject(error));
        });
    }

    /**
     * Handle errors on facebook login.
     *
     * @param  {object} error
     * @return {void}
     */
    handleLoginError = (error) => console.log(error);
}
