import { TestBed } from '@angular/core/testing';

import { Token } from './token';
import { Config } from '../../config';
import { LocalStorage } from '../storage/local';
import { CookieStorage } from '../storage/cookie';
import { CookieState } from '../state/cookie-state.service';
import { NgKitModule } from '../../ngkit.module';
import { SessionStorage } from '../storage';

describe('Token', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgKitModule],
    })
  });

  it('should be created', () => {
    const service = TestBed.inject(Token);
    expect(service).toBeTruthy();
  });

  it('can retrieve a stored token', async () => {
    const service: Token = TestBed.inject(Token);
    const cookieState: CookieState = TestBed.inject(CookieState);
    const cookie: CookieStorage = TestBed.inject(CookieStorage);
    cookieState.clear();
    cookie.clear();

    service.localStorage.clear();

    await service.set('TEST_TOKEN');

    const token1 = await service.get();
    const token2 = await service.get()

    expect(token1).toBeDefined();
    expect(token1).toEqual('TEST_TOKEN');
    expect(token2).toBeDefined();
    expect(token2).toEqual('TEST_TOKEN');
  });

  it('can store a token', async () => {
    const service: Token = TestBed.inject(Token);
    await service.set('TEST_TOKEN');
    const token = await service.get();

    expect(token).toBeDefined();
    expect(token).toEqual('TEST_TOKEN');
  });

  it('can remove a token', async () => {
    const service: Token = TestBed.inject(Token);
    await service.set('TEST_TOKEN');
    let token = await service.get();

    expect(token).toBeDefined();
    expect(token).toEqual('TEST_TOKEN');

    await service.remove();
    token = await service.get();

    expect(token).toBeUndefined();
  });

  it('can read a token from a response object', () => {
    const service: Token = TestBed.inject(Token);
    const response = {
      access_token: 'TEST_TOKEN',
    };

    const token = service.read(response);

    expect(token).toEqual('TEST_TOKEN');
  });

  it('can drop off a token before the window unloads', async (done) => {
    const config: Config = TestBed.inject(Config);
    config.set('token.rotateCookies', true);
    config.set('cookies.secure', false);

    const token: Token = TestBed.inject(Token);
    const cookie: CookieStorage = TestBed.inject(CookieStorage);
    const cookieState: CookieState = TestBed.inject(CookieState);
    const localStorage: LocalStorage = TestBed.inject(LocalStorage);
    const event = new Event('beforeunload');
    cookieState.clear();
    cookie.clear();

    await token.set('TEST_TOKEN');
    await localStorage.set('logged_in', true);

    window.dispatchEvent(event);

    setTimeout(async () => {
      expect(await cookieState.get('_token')).toEqual('TEST_TOKEN');
      done();
    }, 1000);
  });

  it('cant drop off a token when the logged state is not true', async (done) => {
    const config: Config = TestBed.inject(Config);
    config.set('token.rotateCookies', true);
    config.set('cookies.secure', false);

    const token: Token = TestBed.inject(Token);
    const cookieState: CookieState = TestBed.inject(CookieState);
    const cookie: CookieStorage = TestBed.inject(CookieStorage);
    cookieState.clear();
    cookie.clear();

    const localStorage: LocalStorage = TestBed.inject(LocalStorage);
    const event = new Event('beforeunload');
    await localStorage.set('logged_in', false);
    token.set('TEST_TOKEN');
    window.dispatchEvent(event);

    setTimeout(async () => {
      expect(await cookieState.get('_token')).toEqual(null);
      done();
    });
  });

  it('can pick up a token when the service initializes', async (done) => {
    const config: Config = TestBed.inject(Config);
    config.set('token.rotateCookies', true);
    config.set('cookies.secure', false);
    const cookieState: CookieState = TestBed.inject(CookieState);
    const cookie: CookieStorage = TestBed.inject(CookieStorage);
    cookieState.clear();
    cookie.clear();
    cookieState.set('_ngktk', btoa(JSON.stringify(['_token'])));
    cookieState.set('_token', 'TEST_TOKEN');
    const token: Token = TestBed.inject(Token);

    setTimeout(async () => {
      expect(await cookieState.get('_ngktk')).toBeFalsy();
      expect(await token.get('_token')).toBeTruthy();
      done();
    });
  });

  it('cant pick up a token when the token keys are missing', async (done) => {
    const config: Config = TestBed.inject(Config);
    config.set('token.rotateCookies', true);
    config.set('cookies.secure', false);
    const cookie: CookieStorage = TestBed.inject(CookieStorage);
    await cookie.clear();

    await cookie.set('_ngktk', btoa(JSON.stringify(['_token'])));
    await cookie.remove('_ngktk');

    const token: Token = TestBed.inject(Token);
    await token.remove('_token');

    setTimeout(async () => {
      expect(await cookie.get('_ngktk')).toBeFalsy();
      expect(await token.get('_token')).toBeFalsy();
      done();
    });
  });

  it('can be destroyed', async (done) => {
    const service: Token = TestBed.inject(Token);
    await service.set('TEST_TOKEN');
    service.destroy();
    const token = await service.get('TEST_TOKEN');
    expect(token).toBeUndefined();
    done();
  });

  it('stores the token in session storage if the engine is set to session', async () => {
    const service = TestBed.inject(Token);
    const session = TestBed.inject(SessionStorage);
    await service.set('TEST_TOKEN', '', 'session');
    expect(await session.get('_token')).toBeTruthy()
    expect(await service.get('_token')).toBe('TEST_TOKEN')
  });

  it('removes the token in session storage on destroy', async () => {
    const service = TestBed.inject(Token);
    const session = TestBed.inject(SessionStorage);
    await service.set('TEST_TOKEN', '', 'session');
    await service.destroy();
    expect(await session.get('_token')).toBeFalsy();
    expect(await service.get('_token')).toBeFalsy();
  });
});

