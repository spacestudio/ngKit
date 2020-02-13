import { TestBed } from '@angular/core/testing';

import { CookieState } from './cookie-state.service';
import { CookieStorage } from '../storage';
import { Config } from '../../config';

describe('CookieState', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      Config,
      CookieStorage,
    ]
  }));

  it('should be created', () => {
    const service: CookieState = TestBed.inject(CookieState);
    expect(service).toBeTruthy();
  });

  it('can store values', async () => {
    const service: CookieState = TestBed.inject(CookieState);
    await service.set('test', 'TEST');
    expect(service.state.test).toBeTruthy();
    expect(service.state.test).toEqual('TEST');
  });

  it('can retrieve values', async () => {
    const service: CookieState = TestBed.inject(CookieState);
    await service.set('test', 'TEST');
    expect(service.state.test).toBeTruthy();
    expect(await service.get('test')).toEqual('TEST');
  });

  it('stores cookies with no expiration when authentication is not persisted', async () => {
    const service: CookieState = TestBed.inject(CookieState);
    const config: Config = TestBed.inject(Config);
    config.set('authentication.shouldRemember', false);
    await service.set('test', 'TEST');

    expect(await service.getExpiration()).toBeNull();
    expect(await service.get('test')).toEqual('TEST');
  });
});
