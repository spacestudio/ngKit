import { IDBStorageService } from '../storage/idb-storage.service';
import { Injectable } from '@angular/core';

@Injectable()
export class CryptoService {
  /**
   * Create a new instance of the service.
   */
  constructor(private idbStorageService: IDBStorageService) {}

  /**
   * The key used to encrypt/decrypt.
   */
  private cryptoKey?: CryptoKey | null;

  /**
   * The key used to hash encryption .
   */
  static hashKey = "_ngkeh";

  /**
   * The key used to store encryption .
   */
  static storageKey = "_ngkck";

  /**
   * Determine if encryption is supported.
   */
  canEncrypt(): boolean {
    return !!window?.crypto?.subtle;
  }

  /**
   * Decrypt the token array buffer and return it's value.
   */
  async decrypt(token: ArrayBuffer): Promise<string> {
    if (!token) {
      return "";
    }

    const decrypted = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: await this.getEncryptionHash(),
        tagLength: 128,
      },
      await this.getKey(),
      token
    );

    return new TextDecoder().decode(decrypted);
  }

  /**
   * Destroy the encryption key.
   */
  async destroy(): Promise<boolean> {
    this.cryptoKey = null;
    await this.idbStorageService.remove(CryptoService.storageKey);
    await this.idbStorageService.remove(CryptoService.hashKey);

    return true;
  }

  /**
   * Encode a token and return it's value.
   */
  async encrypt(token: string): Promise<ArrayBuffer> {
    const encoded = new TextEncoder().encode(token);

    try {
      return await window.crypto.subtle.encrypt(
        {
          name: "AES-GCM",
          iv: await this.getEncryptionHash(),
          tagLength: 128,
        },
        await this.getKey(),
        encoded
      );
    } catch (error) {
      console.error("ngkit error: Could not encrypt token.");
      throw error;
    }
  }

  /**
   * Generate the encryption key needed to encrypt and decrypt the token.
   */
  private async generateEncryptionKey(): Promise<CryptoKey> {
    return await window.crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256,
      },
      false,
      ["encrypt", "decrypt"]
    );
  }

  /**
   * Get an encryption hash.
   */
  private async getEncryptionHash(): Promise<ArrayBuffer> {
    let hash;

    if ((hash = await this.idbStorageService.get(CryptoService.hashKey))) {
      return hash;
    } else {
      hash = crypto.getRandomValues(new Uint8Array(256));
    }

    await this.idbStorageService.set(CryptoService.hashKey, hash);

    return hash;
  }

  /**
   * Get the encryption key.
   */
  private async getKey(): Promise<CryptoKey> {
    this.cryptoKey = await this.retrieveKey();

    if (!this.cryptoKey) {
      this.cryptoKey = await this.generateEncryptionKey();
      await this.storeKey();
    }

    return this.cryptoKey;
  }

  /**
   * Retrieve the encryption key from storage.
   */
  private async retrieveKey() {
    const key = await this.idbStorageService.get(CryptoService.storageKey);

    if (key) {
      return key;
    }
  }

  /**
   * Store the encryption key.
   */
  private async storeKey(): Promise<any> {
    return await this.idbStorageService.set(
      CryptoService.storageKey,
      this.cryptoKey
    );
  }
}
