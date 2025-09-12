import { SpoonacularClient } from './api/client.js';
import { initNavbar } from './global-ui/navbar.js';

export async function initPages() {
	initNavbar();
	try {
	} catch (error) {
		console.error('Error during init.', error);
	}
}

document.addEventListener('DOMContentLoaded', async () => {
	await initPages();
});
