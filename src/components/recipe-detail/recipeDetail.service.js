/**
 * @typedef {import('../../types/recipeTypes.js').RecipeFull} Recipe
 * @typedef {import('../../types/recipeTypes.js').RecipeSummary} Summary
 */

// Service logic for recipeDetail goes here.

import { SpoonacularClient } from '../../api/client.js';
import { testRecipe, testRecipeSummary } from '../../data/testRecipe.js';

/**
 *
 * @param {number} recipeId
 */
export async function fetchRecipeDetail(recipeId) {
	const client = new SpoonacularClient();
	try {
		/** @type {Recipe} */ let recipe;
		let summary;
		// recipe = await client.getRecipeInformation(recipeId);
		// summary = await client.getRecipeSummary(recipeId);
		// If test recipe wanted
		recipe = getTestRecipe().testRecipe;
		summary = getTestRecipe().testRecipeSummary;
		return { recipe, summary };
	} catch (error) {
		throw error;
	}
}

function getTestRecipe() {
	return { testRecipe, testRecipeSummary };
}
