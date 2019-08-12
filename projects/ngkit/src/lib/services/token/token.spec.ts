import { Token } from './token';
import { Config } from '../../config';
import { LocalStorage } from '../storage/local';
import { CookieStorage } from '../storage/cookie';
import { Crypto } from '../encryption/crypto';
import { Injector } from '@angular/core';

const createToken = () => {
	const config = new Config({});
	let localStorage;

	return new Token(
		config,
		new CookieStorage(config, Injector()),
		localStorage = new LocalStorage(config),
		new Crypto(localStorage)
	);
}
test('it_can_retrieve_a_stored_token', async () => {
	const service = createToken();
	const token = await service.get()
	expect(token).toBeDefined();
});

test('it_can_store_a_token', () => {

});

test('it_can_remove_a_token', () => {

});

test('it_can_read_a_token_from_a_response_object', () => {

});
