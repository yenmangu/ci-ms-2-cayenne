import { initNavbar } from './global-ui/navbar.js';
export async function initPages() {
	// console.log('initPages()');

	try {
		initNavbar();
	} catch (error) {
		console.error('Error during init.', error);
	}
}

document.addEventListener('DOMContentLoaded', async () => {
	// console.log('awaiting init pages');

	await initPages();
});
