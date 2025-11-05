/**
 * @typedef {import('../../../types/stateTypes.js').ErrorEntry} ErrorEntry
 * @typedef {import('../../../types/errorTypes.js').ErrorType} ErrorType
 * @typedef {import('../../../types/stateTypes.js').ErrorScope} ErrorScope
 */
import { jest } from '@jest/globals';

import { pushError, garbageCollectErrors } from '../error.model.js';

describe('error.model pushError + dedupe', () => {
	/** @type {ErrorEntry} */
	const base = {
		code: 'HTTP_500',
		id: 'a1',
		scope: 'global',
		ts: 1_000,
		type: 'server',
		userMessage: 'x'
	};

	beforeEach(() => {
		jest.spyOn(Date, 'now').mockReturnValue(1_00);
	});
	afterEach(() => {
		jest.restoreAllMocks();
	});

	test('pushError adds first occurence', () => {
		const list = [];
		const next = pushError(list, base);
		expect(next).toHaveLength(1);
		expect(next[0]).toMatchObject({ code: 'HTTP_500', scope: 'global' });
	});

	test('pushError dedupes identical error within TTL', () => {
		const first = pushError([], base);
		const second = pushError(first, { ...base, id: 'a2' });
		expect(second).toBe(first);
		expect(second).toHaveLength(1);
	});

	test('errors older than TTL can be garbageCollected (housekeeping)', () => {
		jest.spyOn(Date, 'now').mockReturnValue(300_001);
		const list = [{ ...base, ts: 0 }];
		const pruned = garbageCollectErrors(list, { max: 50, ttl: 300_000 });
		expect(pruned).toHaveLength(0);
	});

	test('keeps entries newer than TTL', () => {
		jest.spyOn(Date, 'now').mockReturnValue(300_000);
		/** @type {ErrorEntry} */
		const fresh = {
			code: 'HTTP_4XX',
			id: '2',
			scope: 'global',
			ts: 299_99,
			type: 'client',
			userMessage: 'y'
		};
		const kept = garbageCollectErrors([fresh], { max: 50, ttl: 300_000 });
		expect(kept).toHaveLength(1);
	});

	test('trims list to max keeping newest', () => {
		jest.spyOn(Date, 'now').mockReturnValue(1_000_000);
		const mk = i =>
			/** @type {ErrorEntry} */
			({
				code: 'HTTP_500',
				id: String(i),
				scope: /** @type {ErrorScope} */ ('global'),
				ts: 900_000 + i,
				type: /** @type {ErrorType} */ ('server'),
				userMessage: 'x'
			});

		const list = Array.from({ length: 5 }, (_, i) => mk(i)); // ts ascending
		const pruned = garbageCollectErrors(list, { max: 4, ttl: 999_999 });
		expect(pruned).toHaveLength(4);
		expect(pruned.map(e => e.id)).toEqual(['1', '2', '3', '4']);
	});
});
