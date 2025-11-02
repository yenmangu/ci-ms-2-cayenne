/**
 * @typedef {import("../../types/recipeTypes.js").RecipeCard} RecipeCard
 */

import { getClient } from '../../api/client.singleton.js';

/**
 * @typedef {object} GridService
 * @property {object} [opts]
 * @property {object} [filters]
 * @property {RecipeCard[] | null} recipes
 * @property {()=> Promise<RecipeCard[]>} getTestRecipes
 */

/**
 *
 * @param {*} opts
 * @returns {GridService}
 */

export const createGridService = (opts = {}) => {
	const client = getClient();
	const service = {
		opts: {},
		filters: {},
		recipes: null,

		/**
		 * Uses data stored on proxy API to test recipeGrid
		 *
		 * @returns {Promise<RecipeCard[]>}
		 */
		getTestRecipes: async () => {
			/** @type {RecipeCard[]} */
			let data = [];
			if (opts) {
				data = await client.getTestApiRecipes();
				service.recipes = data;
				return data;
			}
		}
	};

	return service;
};
