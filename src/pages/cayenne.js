import { multipleRecipes } from '../data/multipleRecipes.js';
import { RecipeGrid } from '../components/recipe-grid/controller.js';

function fakeFetchRecipes() {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve(multipleRecipes);
		}, 200); // Simulate Network Delay
	});
}

async function initCayenneApp() {
	// TODO Implement live API calls
	const recipes = await fakeFetchRecipes();
	const grid = new RecipeGrid(recipes);
	grid.render();
}

initCayenneApp();
