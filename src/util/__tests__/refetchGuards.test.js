import {
	isRandomKeyOrPath,
	isRecipeDetailKeyOrPath,
	isTestCollectionPath,
	isTestRandomPath,
	shouldBypassFallback
} from '../refetchGuards.js';

describe('refetchGuards', () => {
	describe('isRandomKeyOrPath', () => {
		test('matches known endpoint key', () => {
			expect(isRandomKeyOrPath('getRandomRecipes')).toBe(true);
		});

		test('matches /recipes/random path', () => {
			expect(isRandomKeyOrPath('/recipes/random')).toBe(true);
			expect(isRandomKeyOrPath('/recipes/random/')).toBe(true);
		});

		test('does not match other paths', () => {
			expect(isRandomKeyOrPath('/recipes/123/information')).toBe(false);
			expect(isRandomKeyOrPath('/recipes/test')).toBe(false);
		});
	});

	describe('isRecipeDetailKeyOrPath', () => {
		test('matches known detail keys', () => {
			expect(isRecipeDetailKeyOrPath('getRecipeInformation')).toBe(true);
			expect(isRecipeDetailKeyOrPath('summarizeRecipe')).toBe(true);
		});

		test('matches tokenised paths', () => {
			expect(isRecipeDetailKeyOrPath('/recipes/:id/information')).toBe(true);
			expect(isRecipeDetailKeyOrPath('/recipes/{id}/summary')).toBe(true);
		});

		test('matches concrete id paths', () => {
			expect(isRecipeDetailKeyOrPath('/recipes/42/information')).toBe(true);
			expect(isRecipeDetailKeyOrPath('/recipes/999/summary')).toBe(true);
		});

		test('does not match non-detail paths', () => {
			expect(isRecipeDetailKeyOrPath('/recipes/random')).toBe(false);
			expect(isRecipeDetailKeyOrPath('/recipes/test')).toBe(false);
		});
	});

	describe('isTestRandomPath / isTestCollectionPath', () => {
		test('recognises test-random endpoint', () => {
			expect(isTestRandomPath('/recipes/test-random')).toBe(true);
			expect(isTestRandomPath('/recipes/test-random/')).toBe(true);
			expect(isTestRandomPath('/recipes/test')).toBe(false);
		});

		test('recognises test collection endpoint', () => {
			expect(isTestCollectionPath('/recipes/test')).toBe(true);
			expect(isTestCollectionPath('/recipes/test/')).toBe(true);
			expect(isTestCollectionPath('/recipes/test-random')).toBe(false);
		});
	});

	describe('shouldBypassFallback', () => {
		test('true when refetch is explicitly set', () => {
			expect(shouldBypassFallback({ refetch: true })).toBe(true);
		});

		test('false when refetch is absent or false', () => {
			expect(shouldBypassFallback({})).toBe(false);
			expect(shouldBypassFallback({ refetch: false })).toBe(false);
			expect(shouldBypassFallback()).toBe(false);
		});
	});
});
