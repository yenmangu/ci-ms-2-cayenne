/**
 * @typedef {import('./components/error-message/errorMessage.controller.js').ErrorMessageConfig} ErrorConfig
 */
import { initCayenneApp } from './pages/cayenne.js';
import { ErrorMessage } from './components/error-message/errorMessage.controller.js';
import { startRouter } from './router/appRouter.js';

/**
 * Single point of logic for collecting 'appRoot' element.
 * Injects appRoot into the rest of the cayenne app.
 *
 */
async function initCayenne() {
	const appRoot = document.getElementById('app');
	await initCayenneApp(appRoot);

	// Start the client-side routing
	startRouter(appRoot);
}

initCayenne();
