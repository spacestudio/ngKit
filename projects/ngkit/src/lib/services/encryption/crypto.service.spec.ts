import { CryptoService } from './crypto.service';
import { ConfigSerivce } from '../../config.service';
import { IDBStorageService } from '../storage/idb-storage.service';
import { TestBed } from '@angular/core/testing';

describe("CryptoService", () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [ConfigSerivce, CryptoService, IDBStorageService],
    })
  );

  it("should be created", () => {
    const service: CryptoService = TestBed.inject(CryptoService);
    expect(service).toBeTruthy();
  });

  it("should decrypt data", async () => {
    const service: CryptoService = TestBed.inject(CryptoService);
    const encrypted = await service.encrypt("TEST");

    expect(encrypted).toBeTruthy();

    const decrypted = await service.decrypt(encrypted);

    expect(decrypted).toBeTruthy();
    expect(decrypted).toEqual("TEST");
  });

  it("should encrypt data", async () => {
    const service: CryptoService = TestBed.inject(CryptoService);
    const encrypted = await service.encrypt("TEST");

    expect(encrypted).toBeTruthy();
    expect(encrypted.constructor).toEqual(ArrayBuffer);
  });

  it("should remove encryption key on destroy", async () => {
    const service: CryptoService = TestBed.inject(CryptoService);
    const idb: IDBStorageService = TestBed.inject(IDBStorageService);
    await service.encrypt("TEST");
    service.destroy();

    const key1 = await idb.get(CryptoService.storageKey);
    const key2 = await idb.get(CryptoService.hashKey);

    expect(key1).toBeFalsy();
    expect(key2).toBeFalsy();
  });
});
