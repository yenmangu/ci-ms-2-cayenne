/**
 * @typedef {import("../types/recipeTypes.js").RecipeFull} RecipeFull
 * @typedef {import("../types/recipeTypes.js").RecipeCard} RecipeCard
 */

/**
 * Transform a full recipe object into a recipe card object
 *
 * @param {RecipeFull} recipe
 * @returns {RecipeCard}
 */
export function makeRecipeCard(recipe) {
	return {
		id: recipe.id,
		title: recipe.title,
		image: recipe.image,
		imageType: recipe.imageType
	};
}
