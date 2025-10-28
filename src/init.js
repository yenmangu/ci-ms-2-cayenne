import { initNavbar } from './global-ui/navbar.js';
import { initDevBootstrap } from './util/dev/devBoostrap.js';
import { initStickyFooter } from './util/footerOffsets.js';
export async function initPages() {
	try {
		initNavbar();
		initStickyFooter();
	} catch (error) {
		console.error('Error during init.', error);
	}
}

document.addEventListener('DOMContentLoaded', async () => {
	initDevBootstrap({ forceView: true });
	await initPages();
});
