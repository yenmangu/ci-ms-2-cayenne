/**
 * @typedef {import("../../types/recipeTypes.js").RecipeCard} RecipeCard
 */

/**
 *
 * @param {RecipeCard} recipe
 * @returns {string}
 */
export function renderRecipeCard(recipe) {
	return `
	<a href="#/recipe?id=${recipe.id}" class="card h-100 text-decoration-none text-dark">
			<img src="${recipe.image}" alt="${recipe.title}" class="card-img-top">
			<div class="card-body">
				<h5 class="card-title">${recipe.title}</h5>
			</div>
		</a>
	`;
}
