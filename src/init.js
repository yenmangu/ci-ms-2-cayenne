import { initNavbar } from './global-ui/navbar.js';
export async function initPages() {
	try {
		initNavbar();
	} catch (error) {}
}

document.addEventListener('DOMContentLoaded', async () => {
	// Dev bootstrap
	// initDevBootstrap({ forceView: true });
	await initPages();
});
