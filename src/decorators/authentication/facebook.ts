import {ngKitAuthentication} from './../../services';

export function Facebook(target) {
    // TODO: modify the class constructor
    // TODO: inject Facebook, Ionic? Web?
    //target.prototype.constructor

    /**
     * Login via Facebook.
     *
     * @return {promise}
     */
    target.prototype.loginWithFacebook = (): Promise<any> => {
        return new Promise((resolve, reject) => {
            this.facebook.login().then((res) => {
                this.handleFacebookLoginSuccess(res).subscribe((res: any) => {
                    this.storeToken(res.data.token).then(() => resolve(true));
                }, (error) => reject(this.handleFacebookLoginError(error)))
            });
        });
    }

    /**
     * Handle succesful facebook login.
     *
     * @param  {object} res
     *
     * @return {promise}
     */
    target.prototype.handleFacebookLoginSuccess = (res) => {
        if (res.status == 'connected') {

            let facebook_credentials = {
                facebook_user_id: res.authResponse.userID,
                facebook_access_token: res.authResponse.accessToken,
                facebook_token_expires: res.authResponse.expiresIn
            };

            this.storeToken(res.authResponse.accessToken, 'facebook_access_token');
            this.updateLogingDetails({ method: 'facebook' });

            return this.http.post('auth/login-facebook', facebook_credentials);
        }
    }

    /**
     * Handle errors on facebook login.
     *
     * @param  {object} error
     *
     * @return {[type]}
     */
    target.prototype.handleFacebookLoginError = (error) => console.log(error);

    return target;
}
