/**
 * @typedef {import('../../types/recipeTypes.js').RecipeFull} RecipeFull
 * @typedef {import('../../types/recipeTypes.js').RecipeSummary} Summary
 * @typedef {import('../../types/errorTypes.js').ErrorScope} ErrorScope
 * @typedef {import('../../types/responseTypes.js').FetchResult} FetchResult
 * @typedef {import('../../types/stateTypes.js').ErrorMeta} ErrorMeta
 */

/**
 * @typedef {object} DetailService
 * @property {RecipeFull} fetchedRecipe
 * @property {Summary} recipeSummary
 * @property {object}	[opts]
 * @property {(
 * 	id:number, params: Record<string,
 * 	string | number>
 * 	) => Promise<{fetchedRecipe:RecipeFull, summary:Summary}>
 * } fetchRecipeById
 *
 */

import { getClient } from '../../api/client.singleton.js';
import { testRecipe, testRecipeSummary } from '../../data/testRecipe.js';
import { createErrorPublishing } from '../../error/pipe/publishFactory.js';

/**
 *
 * @param {*} opts
 * @returns {DetailService}
 */
export const createDetailService = opts => {
	const pubs = createErrorPublishing();
	const client = getClient();
	/** @type {DetailService} */
	const service = {
		fetchedRecipe: null,
		/**
		 *
		 * @param {number} [id]
		 * @param {*} [params]
		 * @returns {Promise<{fetchedRecipe: RecipeFull, summary:Summary} | null>}
		 */
		fetchRecipeById: async (id, params = {}) => {
			let results;

			results = await fetchRecipeDetail(id);
			if (results) {
				service.fetchedRecipe = results.recipe;
				service.recipeSummary =
					results.summary ??
					/** @type {Summary} */ (
						/** @type {unknown} */ (results.recipe.summary)
					);
				return {
					fetchedRecipe: service.fetchedRecipe,
					summary: service.recipeSummary
				};
			}
		},
		opts: {},

		recipeSummary: null
	};

	return service;
};

/**
 *
 * @param {number} recipeId
 *
 * @returns {Promise<{recipe:RecipeFull, summary:Summary}>}
 */
/**
 * Fetch recipe detail, using the embedded summary if present; otherwise fetch the summary.
 * @param {number} recipeId
 * @returns {Promise<{ recipe: RecipeFull, summary: Summary }> | null}
 */
export async function fetchRecipeDetail(recipeId) {
	const client = getClient();
	// 1) Always fetch the recipe first
	const infoResult = /** @type {FetchResult} */ (
		await client.getRecipeInformation(recipeId)
	);
	if (!infoResult) {
		return null;
	}

	const recipe = /** @type {RecipeFull} */ (infoResult.data);
	if (!recipe || typeof recipe.id !== 'number') {
		return null;
	}

	// 2) Short-circuit if we can build a summary immediately
	const derived = buildSummaryFromRecipe(recipe);
	if (derived) {
		return { recipe, summary: derived };
	}

	// 3) Otherwise, fetch the summary
	const sumResult = /** @type {FetchResult} */ (
		await client.getRecipeSummary(recipeId)
	);

	const summary = /** @type {Summary} */ (sumResult.data);
	if (!summary || summary.id !== recipe.id) {
		return null;
	}

	return { recipe, summary };
}

function getTestRecipe() {
	return { testRecipe, testRecipeSummary };
}

export function buildSummaryFromRecipe(recipe) {
	const hasString = typeof recipe.summary === 'string';
	const cleaned = hasString ? recipe.summary.trim() : '';
	if (!hasString || cleaned.length === 0) return null;

	return {
		id: recipe.id,
		title: recipe.title,
		summary: cleaned
	};
}
