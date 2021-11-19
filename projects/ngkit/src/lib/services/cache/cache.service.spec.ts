import { CacheService } from './cache.service';
import { NgKitModule } from '../../ngkit.module';
import { IDBStorageService } from '../storage/idb-storage.service';
import { TestBed } from '@angular/core/testing';

describe("CacheService", () => {
  let service: CacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgKitModule],
    });

    service = TestBed.inject(CacheService);
  });

  afterEach(() => {
    service.clear();
  });

  it("should clear the cache", async () => {
    await service.set("foo", "bar");
    const idb = TestBed.inject(IDBStorageService);
    const cachePre = await idb.get(service.cacheName);
    expect(cachePre).toBeDefined();
    await service.clear();
    const cachePost = await idb.get(service.cacheName);
    expect(cachePost).toBeUndefined();
  });

  it("should save the cache to storage", async () => {
    await service.set("foo", "bar");
    const idb = TestBed.inject(IDBStorageService);
    await service.saveCache();
    const cache = await idb.get(service.cacheName);
    expect(cache).toBeDefined();
  });

  it("can cache a string value", async () => {
    await service.set("foo", "bar");
    const string = await service.get("foo");
    expect(string).toEqual("bar");
  });

  it("can cache a boolean value", async () => {
    await service.set("true", true);
    const boolean = await service.get("true");
    expect(boolean).toEqual(true);
  });

  it("can cache an array value", async () => {
    await service.set("names", ["foo", "bar", "baz"]);
    const array = await service.get("names");
    expect(array).toEqual(["foo", "bar", "baz"]);
  });

  it("can cache an object value", async () => {
    await service.set("object", { a: { b: { c: true } } });
    const object = await service.get("object");
    expect(object).toEqual({ a: { b: { c: true } } });
  });

  it("can check if the cache has an item", async () => {
    await service.set("foo", "bar");
    const cache = await service.has("foo");
    expect(cache).toBeTrue();
  });

  it("can pull an item from the cache", async () => {
    await service.set("foo", "bar");
    const value = await service.pull("foo");
    expect(value).toEqual("bar");
    const cache = await service.has("foo");
    expect(cache).toBeFalse();
  });

  it("can remove an item from the cache", async () => {
    await service.set("foo", "bar");
    const cachePre = await service.get("foo");
    expect(cachePre).toBeDefined();
    service.remove("foo");
    const cachePost = await service.get("foo");
    expect(cachePost).toBeNull();
  });

  it("can get an item from the cache that is not expired", async () => {
    await service.set("foo", "bar", 2);
    return new Promise<void>((resolve) => {
      setTimeout(async () => {
        const cache = await service.get("foo");
        expect(cache).toBeDefined();
        resolve();
      }, 1000);
    });
  });

  it("can't get an item from the cache that is not expired", async () => {
    await service.set("foo", "bar", 1);

    return new Promise<void>((resolve) => {
      setTimeout(async () => {
        await service.refresh();
        const cache = await service.get("foo");
        expect(cache).toBeNull();
        resolve();
      }, 1000);
    });
  });
});
