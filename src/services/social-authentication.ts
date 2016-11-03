import * as hello from 'hellojs';
import { Authentication } from  './authentication';
import { Authorization } from './authorization';
import { Injectable } from '@angular/core';
import { Config } from './../config';
import { Observable } from 'rxjs';
import { Http } from './http';
import { Token } from './token';
import { Event } from './event';

@Injectable()
export class SocialAuthentication extends Authentication {
    /**
     * Hellojs provider.
     *
     * @type {HelloJSStatic}
     */
    private hello;

    /**
     * Constructor.
     */
    constructor(
        public authorization: Authorization,
        public config: Config,
        public event: Event,
        public http: Http,
        public token: Token
    ) {
        super(authorization, config, event, http, token);

        hello.init({
            facebook: this.config.get('authentication.social.facebook.id'),
            twitter: this.config.get('authentication.social.twitter.id')
        }, {
                redirect_uri: this.config.get('authentication.social.redirectTo'),
                oauth_proxy: this.config.get('authentication.social.oauthProxy')
            });
    }

    /**
     * Login with a social provider.
     *
     * @return {promise}
     */
    login(provider: string, options?: any): Promise<any> {
        return new Promise((resolve, reject) => {
            hello(provider).login(options).then((res) => {
                this.handleLoginSuccess(res).then((res) => {
                    this.onLogin(res).then(() => resolve(res));
                }, (error) => reject(this.handleLoginError(error)))
            });
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
            this.storeSocialCredentials(res);

            this.updateLogingDetails({ method: res.network });

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

    /**
     * Store social auth crednetials.
     *
     * @param  {any} res
     * @return {void}
     */
    storeSocialCredentials(res): void {
        if (res.network == 'facebook') {
            this.token.set(
                res.authResponse.accessToken,
                'facebook_access_token'
            );
        }
    }
}
