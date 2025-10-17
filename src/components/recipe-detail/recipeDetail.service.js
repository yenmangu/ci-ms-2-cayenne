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

/**
 *
 * @param {*} opts
 * @returns {DetailService}
 */
export const createDetailService = opts => {
	const client = new SpoonacularClient();
	/** @type {DetailService} */
	const service = {
		opts: {},
		fetchedRecipe: null,
		recipeSummary: null,

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
		}
	};

	return service;
};

// Service logic for recipeDetail goes here.

import { SpoonacularClient } from '../../api/client.js';
import { testRecipe, testRecipeSummary } from '../../data/testRecipe.js';

/**
 *
 * @param {number} recipeId
 *
 * @returns {Promise<{recipe:RecipeFull, summary:Summary}>}
 */
export async function fetchRecipeDetail(recipeId) {
	const client = new SpoonacularClient();
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
			// debugger;
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
