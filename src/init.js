import { SpoonacularClient } from './api/client.js';
import { initNavbar } from './global-ui/navbar.js';

export async function initPages() {
	try {
		initNavbar();
		const client = new SpoonacularClient();
		const data = await client.findByIngredients(
			['apples', 'flour', 'sugar'],
			2
		);
		if (data) {
			console.log('🍽️ Recipes found:', data);
		}

		const recipes = await client.searchRecipes(['pasta'], {
			cuisine: 'italian',
			number: 3
		});
		if (recipes) {
			console.log('Recipes Found for searchRecipes: ', recipes);
		}
	} catch (error) {
		console.error('Error during init.', error);
	}
}

document.addEventListener('DOMContentLoaded', async () => {
	await initPages();
});
