import { SpoonacularClient } from './client.js';
import { ENV } from '../env.js';

let _client = null;

function _create(env = ENV) {
	const c = new SpoonacularClient();
	// optional headers
	return c;
}

export function getClient() {
	if (!_client) _client = _create();
	return _client;
}

export function configClientFactory(factory) {
	_client = factory ? factory() : _create();
}

export function resetClientForTests() {
	_client = null;
}
