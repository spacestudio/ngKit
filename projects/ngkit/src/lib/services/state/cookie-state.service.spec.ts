import { CookieState } from './cookie-state.service';
import { ConfigSerivce } from '../../config.service';
import { CookieStorageService } from '../storage/cookie-storage.service';
import { TestBed } from '@angular/core/testing';

describe("CookieState", () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [ConfigSerivce, CookieStorageService],
    })
  );

  it("should be created", () => {
    const service: CookieState = TestBed.inject(CookieState);
    expect(service).toBeTruthy();
  });

  it("can store values", async () => {
    const service: CookieState = TestBed.inject(CookieState);
    await service.set("test", "TEST");
    expect(service.state.test).toBeTruthy();
    expect(service.state.test).toEqual("TEST");
  });

  it("can retrieve values", async () => {
    const service: CookieState = TestBed.inject(CookieState);
    await service.set("test", "TEST");
    expect(service.state.test).toBeTruthy();
    expect(await service.get("test")).toEqual("TEST");
  });

  it("stores cookies with no expiration when authentication is not persisted", async () => {
    const service: CookieState = TestBed.inject(CookieState);
    const config: ConfigSerivce = TestBed.inject(ConfigSerivce);
    config.set("authentication.shouldRemember", false);
    await service.set("test", "TEST");

    expect(await service.getExpiration()).toBeNull();
    expect(await service.get("test")).toEqual("TEST");
  });
});
