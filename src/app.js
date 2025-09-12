/**
 * @typedef {import('./components/error-message/errorMessage.controller.js').ErrorMessageConfig} ErrorConfig
 */
import { initCayenneApp } from './pages/cayenne.js';
import { ErrorMessage } from './components/error-message/errorMessage.controller.js';
import { startRouter } from './router/appRouter.js';
import { initNavbar } from './global-ui/navbar.js';

/**
 * Single point of logic for collecting 'appRoot' element.
 * Injects appRoot into the rest of the cayenne app.
 *
 */
async function initCayenne() {
	initNavbar();
	const appRoot = document.getElementById('app');
	// await initCayenneApp(appRoot);

	// Start the client-side routing
	startRouter(appRoot);
}

initCayenne();
