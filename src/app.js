/**
 * @typedef {import('./components/error-message/errorMessage.controller.js').ErrorMessageConfig} ErrorConfig
 */
import { initCayenneApp } from './pages/cayenne.js';
import { appStore } from './appStore.js';
import { initNavbar } from './global-ui/navbar.js';
import { ErrorMessage } from './components/error-message/errorMessage.controller.js';
import { startRouter } from './router/appRouter.js';
import { AppHeader } from './components/app-header/appHeader.controller.js';

/**
 * Single point of logic for collecting 'appRoot' element.
 * Injects appRoot into the rest of the cayenne app.
 *
 */
async function initCayenne() {
	initNavbar();
	const appRoot = document.getElementById('app');
	const main = document.getElementById('cayenne-main');
	const appHeaderComponent = new AppHeader(main);
	if (appHeaderComponent)
		document.body.insertBefore(appHeaderComponent.header, main);
	appHeaderComponent.init();
	// Start the client-side routing
	console.log('Starting router');

	startRouter(appRoot);
}

initCayenne();
