import { TestBed } from '@angular/core/testing';
import { Config } from '../../config';
import { Crypto } from './crypto';
import { LocalStorage } from '../storage/local';

describe('Crypto', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      Config,
      Crypto,
      LocalStorage,
    ]
  }));

  it('should be created', () => {
    const service: Crypto = TestBed.get(Crypto);
    expect(service).toBeTruthy();
  });

  it('should decrypt data', async () => {
    const service: Crypto = TestBed.get(Crypto);
    const encrypted = await service.encrypt('TEST');

    expect(encrypted).toBeTruthy();

    const decrypted = await service.decrypt(encrypted);

    expect(decrypted).toBeTruthy();
    expect(decrypted).toEqual('TEST');
  });

  it('should encrypt data', async () => {
    const service: Crypto = TestBed.get(Crypto);
    const encrypted = await service.encrypt('TEST');

    expect(encrypted).toBeTruthy();
    expect(encrypted.constructor).toEqual(ArrayBuffer);
  });

  it('should remove encryption keys on destroy', async () => {
    const service: Crypto = TestBed.get(Crypto);
    const localStorage: LocalStorage = TestBed.get(LocalStorage);
    service.destroy();
    const keys = await localStorage.get(Crypto.storageKey);

    expect(keys).toBeFalsy();
  });
});
