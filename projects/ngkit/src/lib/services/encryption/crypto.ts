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
	static storageKey = 'auth_token_keys';

	/**
	 * Decrypt the token array buffer and return it's value.
	 */
	async decrypt(token: ArrayBuffer): Promise<string> {
		await this.getKeys()
		const algorithm = { name: 'RSA-OAEP' };
		const key = this.privateKey;
		const decrypted = await crypto.subtle.decrypt(algorithm, key, token);

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
		const algorithm = { name: 'RSA-OAEP' };
		const key = this.publicKey;
		const encoded = (new TextEncoder()).encode(token);
		const encrypted = await window.crypto.subtle.encrypt(algorithm, key, encoded);

		return encrypted;
	}

	/**
	 * Generate the encryption keys needed to encrypt and decrypt the token.
	 */
	async generateEncryptionKeys(): Promise<CryptoKeyPair> {
		const algorithm = {
			name: "RSA-OAEP",
			modulusLength: 4096,
			publicExponent: new Uint8Array([1, 0, 1]),
			hash: "SHA-256",
		};

		return await window.crypto.subtle.generateKey(algorithm, true, ['encrypt', 'decrypt']);
	}

	/**
	 * Get the encryption keys.
	 */
	async getKeys(): Promise<CryptoKeyPair> {
		let keys = await this.retrieveKeys();

		if (!keys) {
			keys = await this.generateEncryptionKeys();
		}

		const { privateKey, publicKey } = keys;
		this.privateKey = privateKey;
		this.publicKey = publicKey;

		return this.keys;
	}

	/**
	 * Retrieve the encryption keys from storage.
	 */
	async retrieveKeys() {
		const keys = await this.localStorage.get(Crypto.storageKey);

		if (keys) {
			return keys;
		}
	}

	/**
	 * Store the encryption keys.
	 */
	async storeKeys(): Promise<any> {
		return await this.localStorage.set(Crypto.storageKey, this.keys);
	}

	// async set(toke: string) {
	// 	return this.token = await this.encryptToken(token);
	// }

	// async get() {
	// 	return await this.decryptToken(this.token);
	// }
}