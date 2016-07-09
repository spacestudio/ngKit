import { Observable } from 'rxjs';

declare var FB: any;

export function FacebookAuthentication() {
    // TODO: modify the class constructor
    // TODO: inject Facebook, Ionic? Web?
    //target.prototype.constructor
    return (target) => {
        /**
         * Init Facebook Web SDK.
         *
         * @return {void}
         */
        target.prototype.initFacebookWebSdk = () => {
            window['fbAsyncInit'] = function() {
                FB.init({
                    appId: this.config.get('authentication.social.facebook.appId'),
                    xfbml: this.config.get('authentication.social.facebook.xfbml'),
                    version: this.config.get('authentication.social.facebook.version')
                });
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
        target.prototype.loginWithFacebook = (): Promise<any> => {
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
        target.prototype.handleFacebookLoginSuccess = (res): Observable<any> => {
            if (res.status == 'connected') {
                // let facebook_credentials = {
                //     facebook_user_id: res.authResponse.userID,
                //     facebook_access_token: res.authResponse.accessToken,
                //     facebook_token_expires: res.authResponse.expiresIn
                // };

                this.token.store(res.authResponse.accessToken, 'facebook_access_token');
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
        target.prototype.handleFacebookLoginError = (error) => console.log(error);

        return target;
    }
}
