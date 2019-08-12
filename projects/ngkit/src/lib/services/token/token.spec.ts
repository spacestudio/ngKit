import { TestBed } from '@angular/core/testing';

import { Token } from './token';
import { Config } from '../../config';
import { LocalStorage } from '../storage/local';
import { CookieStorage } from '../storage/cookie';
import { Crypto } from '../encryption/crypto';
import { Injector } from '@angular/core';

describe('Token', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      CookieStorage,
      Config,
      Crypto,
      LocalStorage,
      Token,
    ]
  }));

  it('should be created', () => {
    const service: Token = TestBed.get(Token);
    expect(service).toBeTruthy();
  });

  it('can retrieve a stored token', async () => {
    const service: Token = TestBed.get(Token);
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
    const service: Token = TestBed.get(Token);
    await service.set('TEST_TOKEN');
    const token = await service.get();

    expect(token).toBeDefined();
    expect(token).toEqual('TEST_TOKEN');
  });

  it('can remove a token', async () => {
    const service: Token = TestBed.get(Token);
    await service.set('TEST_TOKEN');
    let token = await service.get();

    expect(token).toBeDefined();
    expect(token).toEqual('TEST_TOKEN');

    await service.remove();
    token = await service.get();

    expect(token).toBeUndefined();
  });

  it('can read a token from a response object', () => {
    const service: Token = TestBed.get(Token);
    const response = {
      token: 'TEST_TOKEN',
    };

    const token = service.read(response);

    expect(token).toEqual('TEST_TOKEN');
  });
});

