import { Authentication } from './authentication';
import { Authorization } from './authorization';
import { Injectable } from '@angular/core';
import { Config } from './../config';
import { HttpClient } from '@angular/common/http';
import { Http } from './http';
import { Token } from './token';
import { Event } from './event';

@Injectable()
export class SocialAuthentication extends Authentication {
    /**
     * Constructor.
     */
    constructor(
        public authorization: Authorization,
        public config: Config,
        public event: Event,
        public http: HttpClient,
        public httpService: Http,
        public token: Token
    ) {
        super(authorization, config, event, http, httpService, token);

        //
    }

    /**
     * Login with a social provider.
     */
    // login(provider: string, options?: any): Promise<any> {
    //     return new Promise(() => {
    //         // this.handleLoginSuccess(res).then((res) => {
    //         //     this.onLogin(res).then(() => resolve(res));
    //         // }, (error) => reject(this.handleLoginError(error)))
    //     });
    // }

    /**
     * Handle succesful Facebook login.
     *
     * @param  res
     */
    handleLoginSuccess(res: object): Promise<any> {
        return new Promise((resolve, reject) => {
            this.storeSocialCredentials(res);

            this.http.post(
                this.config.get('authentication.endpoints.socialAuth'),
                res
            ).subscribe(res => {
                this.onLogin(res).then(() => {
                    resolve(res);
                }, error => reject(error));
            }, error => reject(error));
        });
    }

    /**
     * Handle errors on facebook login.
     *
     * @param  error
     */
    handleLoginError = (error: object) => console.log(error);

    /**
     * Store social auth crednetials.
     *
     * @param  res
     */
    storeSocialCredentials(res: any): void {
        if (res.network == 'facebook') {
            this.token.set(
                res.authResponse.accessToken,
                'facebook_access_token'
            );
        }
    }
}
