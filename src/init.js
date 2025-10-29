import { initNavbar } from './global-ui/navbar.js';
import { initDevBootstrap } from './util/dev/devBoostrap.js';
export async function initPages() {
	try {
		initNavbar();
	} catch (error) {
		console.error('Error during init.', error);
	}
}

document.addEventListener('DOMContentLoaded', async () => {
	// Dev bootstrap
	// initDevBootstrap({ forceView: true });
	await initPages();
});
