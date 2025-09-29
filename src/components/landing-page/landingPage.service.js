/**
 * @typedef {import('../../types/recipeTypes.js').RecipeFull} RecipeFull
 * @typedef {import('../../types/recipeTypes.js').RecipeCard} RecipeCardObject
 */

/**
 * @typedef {object} LandingService
 * @property {SpoonacularClient} client
 * @property {RecipeFull} fetchedRecipe
 * @property {number} recipeId
 * @property {RecipeCardObject} recipeCard
 * @property {function(): Promise<RecipeCardObject>} getRandomRecipe
 * @property {function(): Promise<RecipeFull>} fetchRandomRecipe
 * @property {function(RecipeFull): RecipeCardObject} extractCard
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
		recipeCard: null,
		getRandomRecipe: async () => {
			await service.fetchRandomRecipe();
			service.recipeCard = service.extractCard(service.fetchedRecipe);
			return service.recipeCard;
		},
		/**
		 *
		 * @param {RecipeFull} recipe
		 * @returns {RecipeCardObject}
		 */
		extractCard: recipe => {
			if (recipe.id === undefined) throw new Error('Error recipe not found');
			return {
				id: recipe.id,
				image: recipe.image ?? 'Image Not Found',
				imageType: recipe.imageType ?? 'Image not found',
				title: recipe.title
			};
		},
		fetchRandomRecipe: async () => {
			const recipe = await service.client.getRandomRecipe();
			service.fetchedRecipe = recipe;
			service.recipeId = service.fetchedRecipe.id;
			return recipe;
		}
	};

	return service;
};
