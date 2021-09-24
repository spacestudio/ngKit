import { TokenService } from './token.service';
import { ConfigSerivce } from '../../config.service';
import { NgKitModule } from '../../ngkit.module';
import { CookieState } from '../state/cookie-state.service';
import { CookieStorageService } from '../storage/cookie-storage.service';
import { IDB } from '../storage/idb-storage.service';
import { SessionStorageService } from '../storage/session-storage.service';
import { TestBed } from '@angular/core/testing';

describe("TokenService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgKitModule],
    });
  });

  afterEach(() => {
    const service: TokenService = TestBed.inject(TokenService);
    service.destroy();
  });

  it("should be created", () => {
    const service: TokenService = TestBed.inject(TokenService);
    expect(service).toBeTruthy();
  });

  it("can retrieve a stored token", async () => {
    const service: TokenService = TestBed.inject(TokenService);
    const cookieState: CookieState = TestBed.inject(CookieState);
    const cookie: CookieStorageService = TestBed.inject(CookieStorageService);
    cookieState.clear();
    cookie.clear();

    service.idb.clear();

    await service.set("TEST_TOKEN");

    const token1 = await service.get();
    const token2 = await service.get();

    expect(token1).toBeDefined();
    expect(token1).toEqual("TEST_TOKEN");
    expect(token2).toBeDefined();
    expect(token2).toEqual("TEST_TOKEN");
  });

  it("can store a token", async () => {
    const service: TokenService = TestBed.inject(TokenService);
    await service.set("TEST_TOKEN");
    const token = await service.get();

    expect(token).toBeDefined();
    expect(token).toEqual("TEST_TOKEN");
  });

  it("can remove a token", async () => {
    const service: TokenService = TestBed.inject(TokenService);
    await service.set("TEST_TOKEN");
    let token = await service.get();

    expect(token).toBeDefined();
    expect(token).toEqual("TEST_TOKEN");

    await service.remove();
    token = await service.get();

    expect(token).toBeUndefined();
  });

  it("can read a token from a response object", () => {
    const service: TokenService = TestBed.inject(TokenService);
    const response = { access_token: "TEST_TOKEN" };
    const token = service.read(response);

    expect(token).toEqual("TEST_TOKEN");
  });

  it("can drop off a token before the window unloads", async (done) => {
    const config: ConfigSerivce = TestBed.inject(ConfigSerivce);
    config.set("token.rotateCookies", true);
    config.set("cookies.secure", false);

    const token: TokenService = TestBed.inject(TokenService);
    const cookie: CookieStorageService = TestBed.inject(CookieStorageService);
    const cookieState: CookieState = TestBed.inject(CookieState);
    const idb: IDB = TestBed.inject(IDB);
    const event = new Event("beforeunload");
    cookieState.clear();
    cookie.clear();

    await token.set("TEST_TOKEN");
    await idb.set("logged_in", true);

    window.dispatchEvent(event);

    setTimeout(async () => {
      expect(await cookieState.get("_token")).toEqual("TEST_TOKEN");
      done();
    }, 1000);
  });

  it("cant drop off a token when the logged state is not true", async (done) => {
    const config: ConfigSerivce = TestBed.inject(ConfigSerivce);
    config.set("token.rotateCookies", true);
    config.set("cookies.secure", false);

    const token: TokenService = TestBed.inject(TokenService);
    const cookieState: CookieState = TestBed.inject(CookieState);
    const cookie: CookieStorageService = TestBed.inject(CookieStorageService);
    cookieState.clear();
    cookie.clear();

    const idb: IDB = TestBed.inject(IDB);
    const event = new Event("beforeunload");
    await idb.set("logged_in", false);
    token.set("TEST_TOKEN");
    window.dispatchEvent(event);

    setTimeout(async () => {
      expect(await cookieState.get("_token")).toEqual(null);
      done();
    });
  });

  it("can pick up a token when the service initializes", async (done) => {
    const config: ConfigSerivce = TestBed.inject(ConfigSerivce);
    config.set("token.rotateCookies", true);
    config.set("cookies.secure", false);
    const cookieState: CookieState = TestBed.inject(CookieState);
    const cookie: CookieStorageService = TestBed.inject(CookieStorageService);
    await cookieState.clear();
    await cookie.clear();
    await cookieState.set("_ngktk", btoa(JSON.stringify(["_token"])));
    await cookieState.set("_token", "TEST_TOKEN");
    const service: TokenService = TestBed.inject(TokenService);

    setTimeout(async () => {
      expect(await cookieState.get("_ngktk")).toBeFalsy();
      expect(await service.get("_token")).toBeTruthy();
      done();
    });
  });

  it("cant pick up a token when the token keys are missing", async (done) => {
    const config: ConfigSerivce = TestBed.inject(ConfigSerivce);
    config.set("token.rotateCookies", true);
    config.set("cookies.secure", false);
    const cookie: CookieStorageService = TestBed.inject(CookieStorageService);
    await cookie.clear();

    await cookie.set("_ngktk", btoa(JSON.stringify(["_token"])));
    await cookie.remove("_ngktk");

    const token: TokenService = TestBed.inject(TokenService);
    await token.remove("_token");

    setTimeout(async () => {
      expect(await cookie.get("_ngktk")).toBeFalsy();
      expect(await token.get("_token")).toBeFalsy();
      done();
    });
  });

  it("can be destroyed", async (done) => {
    const service: TokenService = TestBed.inject(TokenService);
    await service.set("TEST_TOKEN");
    service.destroy();
    const token = await service.get("TEST_TOKEN");
    expect(token).toBeUndefined();
    done();
  });

  it("stores the token in session storage if the engine is set to session", async () => {
    const service = TestBed.inject(TokenService);
    const session = TestBed.inject(SessionStorageService);
    await service.destroy();
    await service.set("TEST_TOKEN", "", "session");
    expect(await session.get("_token")).toBeTruthy();
    expect(await service.get("_token")).toEqual("TEST_TOKEN");
  });

  it("removes the token in session storage on destroy", async () => {
    const service = TestBed.inject(TokenService);
    const session = TestBed.inject(SessionStorageService);
    await service.set("TEST_TOKEN", "", "session");
    await service.destroy();
    expect(await session.get("_token")).toBeFalsy();
    expect(await service.get("_token")).toBeFalsy();
  });

  // fit('emits an event to window storage when tokens are set', async (done) => {
  //   const service = TestBed.inject(TokenService);
  //   let listener;

  //   window.addEventListener('storage', listener = (event) => {
  //     console.log("LOG: window.addEventListener -> event", event)
  //     if (event.key == '_ngktkev') {
  //       const data = JSON.parse(event.newValue);

  //       console.log("LOG: window.addEventListener -> data", data)
  //       if (data) {
  //         expect(data.key).toEqual('_token');
  //         window.removeEventListener('storage', listener)
  //       }

  //       done();
  //     }
  //   });

  //   await service.set('TEST_TOKEN', '', 'session');
  // });
});
