/**
 * This file is generated by the Angular 2 template compiler.
 * Do not edit.
 */
 /* tslint:disable */

import * as import0 from '@angular/core/src/linker/ng_module_factory';
import * as import1 from './ngkit';
import * as import2 from '@angular/http/src/http_module';
import * as import3 from '@angular/http/src/backends/browser_xhr';
import * as import4 from '@angular/http/src/base_response_options';
import * as import5 from '@angular/http/src/backends/xhr_backend';
import * as import6 from '@angular/http/src/base_request_options';
import * as import7 from './services/authorization';
import * as import8 from './config';
import * as import9 from './services/event';
import * as import10 from './services/token';
import * as import11 from './services/http';
import * as import12 from './services/authentication';
import * as import13 from './services/social-authentication';
import * as import14 from './services/storage';
import * as import15 from './services/cache';
import * as import16 from '@angular/core/src/di/injector';
import * as import17 from './providers';
import * as import18 from '@angular/http/src/interfaces';
import * as import19 from '@angular/http/src/http';
class ngKitModuleInjector extends import0.NgModuleInjector<import1.ngKitModule> {
  _HttpModule_0:import2.HttpModule;
  _ngKitModule_1:import1.ngKitModule;
  __BrowserXhr_2:import3.BrowserXhr;
  __ResponseOptions_3:import4.BaseResponseOptions;
  __XSRFStrategy_4:any;
  __XHRBackend_5:import5.XHRBackend;
  __RequestOptions_6:import6.BaseRequestOptions;
  __Http_7:any;
  __Authorization_8:import7.Authorization;
  __Config_9:import8.Config;
  __Event_10:import9.Event;
  __Token_11:import10.Token;
  __Http_12:import11.Http;
  __Authentication_13:import12.Authentication;
  __SocialAuthentication_14:import13.SocialAuthentication;
  __LocalStorage_15:import14.LocalStorage;
  __Cache_16:import15.Cache;
  constructor(parent:import16.Injector) {
    super(parent,[],[]);
  }
  get _BrowserXhr_2():import3.BrowserXhr {
    if ((this.__BrowserXhr_2 == (null as any))) { (this.__BrowserXhr_2 = new import3.BrowserXhr()); }
    return this.__BrowserXhr_2;
  }
  get _ResponseOptions_3():import4.BaseResponseOptions {
    if ((this.__ResponseOptions_3 == (null as any))) { (this.__ResponseOptions_3 = new import4.BaseResponseOptions()); }
    return this.__ResponseOptions_3;
  }
  get _XSRFStrategy_4():any {
    if ((this.__XSRFStrategy_4 == (null as any))) { (this.__XSRFStrategy_4 = import17.XSRFStrategyFactory()); }
    return this.__XSRFStrategy_4;
  }
  get _XHRBackend_5():import5.XHRBackend {
    if ((this.__XHRBackend_5 == (null as any))) { (this.__XHRBackend_5 = new import5.XHRBackend(this._BrowserXhr_2,this._ResponseOptions_3,this._XSRFStrategy_4)); }
    return this.__XHRBackend_5;
  }
  get _RequestOptions_6():import6.BaseRequestOptions {
    if ((this.__RequestOptions_6 == (null as any))) { (this.__RequestOptions_6 = new import6.BaseRequestOptions()); }
    return this.__RequestOptions_6;
  }
  get _Http_7():any {
    if ((this.__Http_7 == (null as any))) { (this.__Http_7 = import2.httpFactory(this._XHRBackend_5,this._RequestOptions_6)); }
    return this.__Http_7;
  }
  get _Authorization_8():import7.Authorization {
    if ((this.__Authorization_8 == (null as any))) { (this.__Authorization_8 = new import7.Authorization()); }
    return this.__Authorization_8;
  }
  get _Config_9():import8.Config {
    if ((this.__Config_9 == (null as any))) { (this.__Config_9 = new import8.Config()); }
    return this.__Config_9;
  }
  get _Event_10():import9.Event {
    if ((this.__Event_10 == (null as any))) { (this.__Event_10 = new import9.Event()); }
    return this.__Event_10;
  }
  get _Token_11():import10.Token {
    if ((this.__Token_11 == (null as any))) { (this.__Token_11 = new import10.Token(this._Config_9)); }
    return this.__Token_11;
  }
  get _Http_12():import11.Http {
    if ((this.__Http_12 == (null as any))) { (this.__Http_12 = new import11.Http(this._Http_7,this._Config_9,this._Event_10,this._Token_11)); }
    return this.__Http_12;
  }
  get _Authentication_13():import12.Authentication {
    if ((this.__Authentication_13 == (null as any))) { (this.__Authentication_13 = new import12.Authentication(this._Authorization_8,this._Config_9,this._Event_10,this._Http_12,this._Token_11)); }
    return this.__Authentication_13;
  }
  get _SocialAuthentication_14():import13.SocialAuthentication {
    if ((this.__SocialAuthentication_14 == (null as any))) { (this.__SocialAuthentication_14 = new import13.SocialAuthentication(this._Authorization_8,this._Config_9,this._Event_10,this._Http_12,this._Token_11)); }
    return this.__SocialAuthentication_14;
  }
  get _LocalStorage_15():import14.LocalStorage {
    if ((this.__LocalStorage_15 == (null as any))) { (this.__LocalStorage_15 = new import14.LocalStorage()); }
    return this.__LocalStorage_15;
  }
  get _Cache_16():import15.Cache {
    if ((this.__Cache_16 == (null as any))) { (this.__Cache_16 = new import15.Cache(this._Config_9,this._Event_10,this._LocalStorage_15)); }
    return this.__Cache_16;
  }
  createInternal():import1.ngKitModule {
    this._HttpModule_0 = new import2.HttpModule();
    this._ngKitModule_1 = new import1.ngKitModule();
    return this._ngKitModule_1;
  }
  getInternal(token:any,notFoundResult:any):any {
    if ((token === import2.HttpModule)) { return this._HttpModule_0; }
    if ((token === import1.ngKitModule)) { return this._ngKitModule_1; }
    if ((token === import3.BrowserXhr)) { return this._BrowserXhr_2; }
    if ((token === import4.ResponseOptions)) { return this._ResponseOptions_3; }
    if ((token === import18.XSRFStrategy)) { return this._XSRFStrategy_4; }
    if ((token === import5.XHRBackend)) { return this._XHRBackend_5; }
    if ((token === import6.RequestOptions)) { return this._RequestOptions_6; }
    if ((token === import19.Http)) { return this._Http_7; }
    if ((token === import7.Authorization)) { return this._Authorization_8; }
    if ((token === import8.Config)) { return this._Config_9; }
    if ((token === import9.Event)) { return this._Event_10; }
    if ((token === import10.Token)) { return this._Token_11; }
    if ((token === import11.Http)) { return this._Http_12; }
    if ((token === import12.Authentication)) { return this._Authentication_13; }
    if ((token === import13.SocialAuthentication)) { return this._SocialAuthentication_14; }
    if ((token === import14.LocalStorage)) { return this._LocalStorage_15; }
    if ((token === import15.Cache)) { return this._Cache_16; }
    return notFoundResult;
  }
  destroyInternal():void {
  }
}
export const ngKitModuleNgFactory:import0.NgModuleFactory<import1.ngKitModule> = new import0.NgModuleFactory(ngKitModuleInjector,import1.ngKitModule);