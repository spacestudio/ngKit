import { Injectable } from "@angular/core";
import { LocalStorage } from "../storage/local";

@Injectable()
export class Crypto {
	/**
	 * Create a new instance of the service.
	 */
  constructor(private localStorage: LocalStorage) { }

  /**
   * The key used to encrypt/decrypt.
   */
  private cryptoKey: CryptoKey;

  /**
	 * The key used to hash encryption .
	 */
  static hashKey = '_ngkeh';

	/**
	 * The key used to store encryption .
	 */
  static storageKey = '_ngkck';

	/**
	 * Decrypt the token array buffer and return it's value.
	 */
  async decrypt(token: ArrayBuffer): Promise<string> {
    if (!token) {
      return;
    }

    await this.getKeys();
    const hash = await this.getEncryptionHash();

    const decrypted = await crypto.subtle.decrypt({
      name: "AES-GCM",
      iv: hash,
      tagLength: 128,
    }, this.cryptoKey, token);

    return (new TextDecoder()).decode(decrypted);
  }

	/**
	 * Destroy the encryption key.
	 */
  async destroy(): Promise<boolean> {
    this.cryptoKey = null;
    await this.localStorage.remove(Crypto.storageKey);
    await this.localStorage.remove(Crypto.hashKey);

    return true;
  }

	/**
	 * Encode a token and return it's value.
	 */
  async encrypt(token: string): Promise<ArrayBuffer> {
    await this.getKeys();
    const encoded = (new TextEncoder()).encode(token);
    const hash = await this.getEncryptionHash();

    try {
      return await window.crypto.subtle.encrypt({
        name: "AES-GCM",
        iv: hash,
        tagLength: 128,
      }, this.cryptoKey, encoded);
    } catch (error) {
      console.error('ngkit error: Could not encrypt token.');
      throw error;
    }
  }

	/**
	 * Generate the encryption key needed to encrypt and decrypt the token.
	 */
  private async generateEncryptionKey(): Promise<CryptoKey> {
    return await window.crypto.subtle.generateKey({
      name: 'AES-GCM',
      length: 256,
    }, false, ['encrypt', 'decrypt']);
  }

  /**
   * Get an encryption hash.
   */
  private async getEncryptionHash(): Promise<ArrayBuffer> {
    let hash;

    if (hash = await this.localStorage.get(Crypto.hashKey)) {
      return hash;
    } else {
      hash = crypto.getRandomValues(new Uint8Array(256));
    }

    await this.localStorage.set(Crypto.hashKey, hash);

    return hash;
  }

	/**
	 * Get the encryption key.
	 */
  private async getKeys(): Promise<CryptoKey> {
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
    const key = await this.localStorage.get(Crypto.storageKey);

    if (key) {
      return key;
    }
  }

	/**
	 * Store the encryption key.
	 */
  private async storeKey(): Promise<any> {
    return await this.localStorage.set(Crypto.storageKey, this.cryptoKey);
  }
}
