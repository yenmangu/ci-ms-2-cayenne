import { multipleRecipes } from '../data/multipleRecipes.js';
import { RecipeGrid } from '../components/recipe-grid/controller.js';

function fakeFetchRecipes() {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve(multipleRecipes);
		}, 100); // Simulate Network Delay
	});
}

async function initCayenneApp() {
	const grid = new RecipeGrid([]);
	grid.setLoading(true);
	grid.render();

	// Dev - uncomment below to only show skeletons
	// return;

	// TODO Implement live API calls
	try {
		const recipes = await fakeFetchRecipes();

		// Executed after promise resolves
		grid.setLoading(false);
		grid.updateCards(recipes);
		grid.render();
	} catch (error) {
		grid.setLoading(false);
		showErrorMessage(error);
	}
}

initCayenneApp();

function showErrorMessage(err) {
	console.warn('ShowErrorMessage not yet implemented', err);
}
