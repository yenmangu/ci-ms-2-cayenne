/**
 * @typedef {import("../../types/recipeTypes.js").RecipeCard} RecipeCardObject
 */

import { RecipeCard } from './recipeCard.controller.js';

/**
 *
 * @param {RecipeCardObject} recipe
 * @returns {string}
 */
export function renderRecipeCard(recipe) {
	return `<div class="wrapper wrapper--card wrapper--random-card">
		<a href="#/recipe?id=${recipe.id}" class="card h-100 text-decoration-none text-dark">
			<img src="${recipe.image}" alt="${recipe.title}" class="card-img-top">
			<div class="card-body">
				<h5 class="card-title">${recipe.title}</h5>
			</div>
			<button
				class="btn btn--like"
				data-like-btn
				tabindex="0"
				aria-pressed="false"
				title="Like this recipe"
				>
				<span class="btn__like-text">Like this recipe</span>
				<i class="fa-regular fa-heart">
					<span class="visually-hidden">Like</span>
				</i>
			</button>
		</a>
	</div>
	`;
}
