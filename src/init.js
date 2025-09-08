import { initNavbar } from './ui/navbar.js';

export async function initPages() {
	try {
		initNavbar();
	} catch (error) {
		console.error('Error during init.', error);
	}
}

document.addEventListener('DOMContentLoaded', async () => {
	await initPages();
});
