/**
 * @typedef {import('../../types/recipeTypes.js').RecipeFull} RecipeFull
 * @typedef {import('../../types/recipeTypes.js').RecipeSummary} Summary
 * @typedef {import('../../types/errorTypes.js').ErrorScope} ErrorScope
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
import { appStore } from '../../appStore.js';
import { SPOONACULAR_ENDPOINTS } from '../../config/endpoints.js';
import { testRecipe, testRecipeSummary } from '../../data/testRecipe.js';
import { reportRefetchMany } from '../../error/util/errorReporter.js';
import { getCurrentRouteScope } from '../../error/util/errorScope.js';

/**
 *
 * @param {*} opts
 * @returns {DetailService}
 */
export const createDetailService = opts => {
	const client = getClient();
	/** @type {DetailService} */
	const service = {
		fetchedRecipe: null,
		/**
		 *
		 * @param {number} [id]
		 * @param {*} [params]
		 * @returns {Promise<{fetchedRecipe: RecipeFull, summary:Summary}>}
		 */
		fetchRecipeById: async (id, params = {}) => {
			const { recipe, summary } = await fetchRecipeDetail(id);
			service.fetchedRecipe = recipe;
			service.recipeSummary = summary;
			return {
				fetchedRecipe: service.fetchedRecipe,
				summary: service.recipeSummary
			};
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
export async function fetchRecipeDetail(recipeId) {
	const client = getClient();
	try {
		/** @type {RecipeFull} */ let recipe;
		/** @type {Summary} */ let summary;
		const dev = false;
		if (dev) {
			// If test recipe wanted
			recipe = getTestRecipe().testRecipe;
			summary = getTestRecipe().testRecipeSummary;
		} else {
			recipe = /** @type {RecipeFull} */ (
				(await client.getRecipeInformation(recipeId)).data
			);
			// summary = recipe.summary

			summary = /** @type {Summary} */ (
				(await client.getRecipeSummary(recipeId)).data
			);
		}

		return { recipe, summary };
	} catch (error) {
		const scope = /** @type {ErrorScope} */ (getCurrentRouteScope());
		const metas = [
			{
				endpoint: SPOONACULAR_ENDPOINTS['getRecipeInformation'],
				params: { id: recipeId }
			},
			{
				endpoint: SPOONACULAR_ENDPOINTS['summarizeRecipe'],
				params: { id: recipeId }
			}
		];
		reportRefetchMany(appStore, scope, metas);
		throw error;
	}
}

function getTestRecipe() {
	return { testRecipe, testRecipeSummary };
}
