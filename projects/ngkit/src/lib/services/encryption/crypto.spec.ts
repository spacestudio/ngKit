import { Crypto } from './crypto';
import { Config } from '../../config';
import { IDB } from '../storage/idb';
import { TestBed } from '@angular/core/testing';

describe("Crypto", () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [Config, Crypto, IDB],
    })
  );

  it("should be created", () => {
    const service: Crypto = TestBed.inject(Crypto);
    expect(service).toBeTruthy();
  });

  it("should decrypt data", async () => {
    const service: Crypto = TestBed.inject(Crypto);
    const encrypted = await service.encrypt("TEST");

    expect(encrypted).toBeTruthy();

    const decrypted = await service.decrypt(encrypted);

    expect(decrypted).toBeTruthy();
    expect(decrypted).toEqual("TEST");
  });

  it("should encrypt data", async () => {
    const service: Crypto = TestBed.inject(Crypto);
    const encrypted = await service.encrypt("TEST");

    expect(encrypted).toBeTruthy();
    expect(encrypted.constructor).toEqual(ArrayBuffer);
  });

  it("should remove encryption key on destroy", async () => {
    const service: Crypto = TestBed.inject(Crypto);
    const idb: IDB = TestBed.inject(IDB);
    await service.encrypt("TEST");
    service.destroy();

    const key1 = await idb.get(Crypto.storageKey);
    const key2 = await idb.get(Crypto.hashKey);

    expect(key1).toBeFalsy();
    expect(key2).toBeFalsy();
  });
});
