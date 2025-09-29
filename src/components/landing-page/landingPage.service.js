/**
 * @typedef {import('../../types/recipeTypes.js').RecipeFull} RecipeFull
 */

/**
 * @typedef {object} LandingService
 * @property {SpoonacularClient} client
 * @property {RecipeFull} fetchedRecipe
 * @property {number} recipeId
 * @property {function(): Promise<RecipeFull>} getRandomRecipe
 *
 */
import { SpoonacularClient } from '../../api/client.js';

/**
 *
 * @param {*} opts
 */

export const createLandingService = opts => {
	const client = new SpoonacularClient();

	/** @type {LandingService} */
	const service = {
		client,
		/** @type {RecipeFull} */ fetchedRecipe: null,
		recipeId: null,
		getRandomRecipe: async () => {
			const recipe = await service.client.getRandomRecipe();
			service.fetchedRecipe = recipe;
			service.recipeId = service.fetchedRecipe.id;
			return recipe;
		}
	};

	return service;
};
