import { TestBed } from '@angular/core/testing';

import { Authentication } from './authentication';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { of, defer } from 'rxjs';
import { Token } from '../token/token';
import { NgKitModule } from '../../ngkit.module';
import { LocalStorage } from '../storage';
import { Config } from '../../config';

describe('Authentication', () => {
  let service: Authentication;
  let configSpy: jasmine.SpyObj<Config>;
  let httpSpy: jasmine.SpyObj<HttpClient>;
  let tokenSpy: jasmine.SpyObj<Token>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgKitModule],
      providers: [
        { provide: Config, useValue: jasmine.createSpyObj('Token', ['get', 'set']) },
        { provide: HttpClient, useValue: jasmine.createSpyObj('HttpClient', ['get', 'post']) },
        { provide: Token, useValue: jasmine.createSpyObj('Token', ['get', 'read', 'set', 'destroy']) },
      ]
    });

    service = TestBed.get(Authentication);
    configSpy = TestBed.get(Config);
    httpSpy = TestBed.get(HttpClient);
    tokenSpy = TestBed.get(Token);
  });

  it('should return false on auth check without a token', async () => {
    tokenSpy.get.and.returnValue(Promise.resolve(null));
    const check = await service.check()
    expect(check).toBeFalsy();
  });

  it('should return true on auth check with a token', async () => {
    httpSpy.get.and.returnValue(of({}));
    tokenSpy.get.and.returnValue(Promise.resolve('TEST_TOKEN'));
    const check = service.check();
    expect(check).toBeTruthy();
  });

  it('should return true on auth check after login', async () => {
    httpSpy.post.and.returnValue(of({
      user: {},
      token: {},
    }));

    httpSpy.get.and.returnValue(of({
      data: {},
    }));

    tokenSpy.read.and.callThrough();
    tokenSpy.set.and.callThrough();

    await service.login({
      username: 'username',
      password: 'password'
    });

    const check = await service.check()
    expect(check).toBeTruthy();

    const localStorage = TestBed.get(LocalStorage);
    const loggedIn = await localStorage.get('logged_in');
    expect(loggedIn).toBeTruthy();
  });

  it('can force check if the user is authenticated', () => {

  });

  it('should send a forgot password request', () => {

  });

  it('should return a redirect value', () => {

  });

  it('should return the authenticated state', () => {

  });

  it('should set the authenticated state', () => {

  });

  it('should log users in', () => {

  });

  it('should log users out', () => {

  });

  it('should return the redirect and remove it', () => {

  });

  it('should send a request to register a user', () => {

  });

  it('should send a request to reset password', () => {

  });

  it('should allow callback functions to be called when unauthenticated', () => {

  });

  it('should allow a redirect to be set', () => {

  });

  it('should allow a authenticated user to be set', () => {

  });

  fit('can logout the current user', async () => {
    const config = TestBed.get(Config);
    const localStorage = TestBed.get(LocalStorage);
    await localStorage.set('logged_in', true)
    configSpy.get.and.returnValue('logout');
    tokenSpy.destroy.and.callThrough();
    httpSpy.post.and.returnValue(
      defer(() => Promise.reject(new HttpErrorResponse({
        error: 'Unauthenticated',
        status: 401,
      })))
    );

    tokenSpy.destroy.and.callThrough();
    expect(await service.logout()).toBeTruthy();
    const check = await service.check()
    expect(check).toBeFalsy();
    expect(service.user()).toBeNull();
    const loggedIn = await localStorage.get('logged_in');
    expect(loggedIn).toBeFalsy();
  });

  it('should unauthenticate', async () => {
    const localStorage = TestBed.get(LocalStorage);
    await localStorage.set('logged_in', true)

    tokenSpy.destroy.and.callThrough();
    await service.unauthenticate();
    const check = await service.check()
    expect(check).toBeFalsy();
    const loggedIn = await localStorage.get('logged_in');
    expect(loggedIn).toBeFalsy();
  });

  it('should return the authenticated user', () => {

  });
});
