/**
 * @typedef {import('../../types/recipeTypes.js').RecipeFull} RecipeFull
 * @typedef {import('../../types/recipeTypes.js').RecipeSummary} Summary
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
import { addImagePlaceholder } from '../../data/addImagePlaceholder.js';
import { testRecipe, testRecipeSummary } from '../../data/testRecipe.js';

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
			recipe = await client.getRecipeInformation(recipeId);
			// summary = recipe.summary

			summary = await client.getRecipeSummary(recipeId);
		}

		return { recipe, summary };
	} catch (error) {
		throw error;
	}
}

function getTestRecipe() {
	return { testRecipe, testRecipeSummary };
}
