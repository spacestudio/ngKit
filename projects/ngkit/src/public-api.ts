/*
 * Public API Surface of ngkit
 */

export { Config } from './lib/config';
export {
  Authentication, Authorization, Cache, Event, Http, SocialAuthentication,
  CookieStorage, LocalStorage, Token
} from './lib/services/index';
export { AuthGuard, AuthResolveGuard } from './lib/guards/index';
export { NGKIT_PROVIDERS } from './lib/providers';
export { Model, ModelFactory } from './lib/models';
export { ngKitModule } from './lib/ngkit.module';
