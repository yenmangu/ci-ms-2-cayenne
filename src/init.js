import { SpoonacularClient } from './api/client.js';
import { initNavbar } from './ui/navbar.js';

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
	} catch (error) {
		console.error('Error during init.', error);
	}
}

document.addEventListener('DOMContentLoaded', async () => {
	await initPages();
});
