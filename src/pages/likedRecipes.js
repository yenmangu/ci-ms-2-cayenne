/**
 * @typedef {import('../types/recipeTypes.js').RecipeCard} RecipeCard
 */

import { LikedRecipes } from '../components/liked-recipes/likedRecipes.controller.js';

const likedRecipeKey = 'LIKED_RECIPES';

export function loadLikedRecipes(container, pathName, params) {
	_devStoreRecipes();
	const fromStorage = loadRecipesFromStorage();
	console.log('From storage: ', fromStorage);

	const likedComponent = initLikedRecipes(container, pathName, {
		recipes: fromStorage
	});
	return likedComponent;
}

/**
 *
 * @returns {RecipeCard[]}
 */
function loadRecipesFromStorage() {
	let toCheck = localStorage.getItem(likedRecipeKey);
	console.log('toCheck string: ', toCheck);

	toCheck = JSON.parse(toCheck);
	console.log('toCheck JSON: ', toCheck);

	if (toCheck)
		if (Array.isArray(toCheck) && toCheck.length) {
			const savedLiked = /** @type {RecipeCard[]} */ (toCheck);
			return savedLiked || [];
		} else {
			return [];
		}
}

/**
 *
 * @param {HTMLElement} appRoot
 * @param {string} pathName
 * @param {object} [params]
 * @param {RecipeCard[]} [params.recipes]
 */
function initLikedRecipes(appRoot, pathName, params = {}) {
	const liked = new LikedRecipes(appRoot, params.recipes);
	liked.grid.setLoading(false);
}

function _devStoreRecipes() {
	/** @type {RecipeCard[]} */
	const devRecipes = [
		{
			title: 'test_1',
			id: 1,
			image: 'test.jpg',
			imageType: 'jpg'
		},
		{
			title: 'test_2',
			id: 2,
			image: 'test_1.jpg',
			imageType: 'jpg'
		},
		{
			title: 'test_3',
			id: 3,
			image: 'test_3.jpg',
			imageType: 'jpg'
		}
	];
	localStorage.setItem(likedRecipeKey, JSON.stringify(devRecipes));
}
