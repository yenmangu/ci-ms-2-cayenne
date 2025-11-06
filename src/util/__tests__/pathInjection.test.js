// src/util/pathInjection.test.js
import {
	buildIdPath,
	injectIdIntoPath,
	pathNeedsId
} from '../pathInjection.js';

describe('pathInjection helpers', () => {
	test('pathNeedsId detects :id and {id}', () => {
		expect(pathNeedsId('/recipes/:id/information')).toBe(true);
		expect(pathNeedsId('/recipes/{id}/summary')).toBe(true);
		expect(pathNeedsId('/recipes/123/information')).toBe(false);
	});

	test('injectIdIntoPath replaces both token styles', () => {
		expect(injectIdIntoPath('/recipes/:id/information', 42)).toBe(
			'/recipes/42/information'
		);
		expect(injectIdIntoPath('/recipes/{id}/summary', '99')).toBe(
			'/recipes/99/summary'
		);
		// No-op if no token
		expect(injectIdIntoPath('/recipes/1/information', 2)).toBe(
			'/recipes/1/information'
		);
	});

	test('buildIdPath injects only when id present', () => {
		expect(buildIdPath('/recipes/:id/summary', { id: 7 })).toBe(
			'/recipes/7/summary'
		);
		expect(buildIdPath('/recipes/:id/summary', {})).toBe(
			'/recipes/:id/summary'
		);
	});
});
