import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Authentication } from  '../../services';

declare let FB: any;

@Injectable()
export class FacebookAuthentication extends Authentication {

    facebook: any;

    /**
     * Init Facebook Web SDK.
     *
     * @return {void}
     */
    initFacebookWebSdk(): void {
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
    loginWithFacebook(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.facebook.login().then((res) => {
                this.handleFacebookLoginSuccess(res).subscribe((res) => {
                    this.onLogin(res).then(() => resolve(res));
                }, (error) => reject(this.handleFacebookLoginError(error)))
            });
        });
    }

    /**
     * Handle succesful Facebook login.
     *
     * @param  {object} res
     * @return {Promise}
     */
    handleFacebookLoginSuccess(res): Observable<any> {
        if (res.status == 'connected') {
            // let facebook_credentials = {
            //     facebook_user_id: res.authResponse.userID,
            //     facebook_access_token: res.authResponse.accessToken,
            //     facebook_token_expires: res.authResponse.expiresIn
            // };

            this.token.set(res.authResponse.accessToken, 'facebook_access_token');
            this.updateLogingDetails({ method: 'facebook' });

            return this.http.post(
                this.config.get('authentication.endpoints.socialAuth'),
                res.authResponse
            );
        }
    }

    /**
     * Handle errors on facebook login.
     *
     * @param  {object} error
     * @return {void}
     */
    handleFacebookLoginError = (error) => console.log(error);
}
