import { Injectable } from "@angular/core";
import { LocalStorage } from "../storage/local";

@Injectable()
export class Crypto {
	/**
	 * Create a new instance of the service.
	 */
  constructor(private localStorage: LocalStorage) { }

	/**
	 * The keys used to encrypt/decrypt.
	*/
  private keys: CryptoKeyPair;

	/**
	 * The private jey of the service.
	 */
  private privateKey: any;

	/**
	 * The public key of the service.
	 */
  private publicKey: any;

	/**
	 * The key used to store encryption keys.
	 */
  static storageKey = '_ngkck';

	/**
	 * Decrypt the token array buffer and return it's value.
	 */
  async decrypt(token: ArrayBuffer): Promise<string> {
    if (!token) {
      return;
    }

    await this.getKeys()
    const decrypted = await crypto.subtle.decrypt('RSA-OAEP', this.privateKey, token);

    return (new TextDecoder()).decode(decrypted);
  }

	/**
	 * Destroy the encryption keys.
	 */
  async destroy(): Promise<boolean> {
    this.keys = null;
    this.privateKey = null;
    this.publicKey = null;

    await this.localStorage.remove(Crypto.storageKey);

    return true;
  }

	/**
	 * Encode a token and return it's value.
	 */
  async encrypt(token: string): Promise<ArrayBuffer> {
    await this.getKeys();
    const encoded = (new TextEncoder()).encode(token);
    const encrypted = await window.crypto.subtle.encrypt('RSA-OAEP', this.publicKey, encoded);

    return encrypted;
  }

	/**
	 * Generate the encryption keys needed to encrypt and decrypt the token.
	 */
  private async generateEncryptionKeys(): Promise<CryptoKeyPair> {
    const algorithm = {
      name: "RSA-OAEP",
      modulusLength: 4096,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    };

    return await window.crypto.subtle.generateKey(algorithm, false, ['encrypt', 'decrypt']);
  }

	/**
	 * Get the encryption keys.
	 */
  private async getKeys(): Promise<CryptoKeyPair> {
    this.keys = await this.retrieveKeys();

    if (!this.keys) {
      this.keys = await this.generateEncryptionKeys();
      await this.storeKeys();
    }

    const { privateKey, publicKey } = this.keys;
    this.privateKey = privateKey;
    this.publicKey = publicKey;

    return this.keys;
  }

	/**
	 * Retrieve the encryption keys from storage.
	 */
  private async retrieveKeys() {
    const keys = await this.localStorage.get(Crypto.storageKey);

    if (keys) {
      return keys;
    }
  }

	/**
	 * Store the encryption keys.
	 */
  private async storeKeys(): Promise<any> {
    return await this.localStorage.set(Crypto.storageKey, this.keys);
  }
}
