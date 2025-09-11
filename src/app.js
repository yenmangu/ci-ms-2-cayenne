/**
 * @typedef {import('./components/error-message/errorMessage.controller.js').ErrorMessageConfig} ErrorConfig
 */
import { initCayenneApp } from './pages/cayenne.js';
import { ErrorMessage } from './components/error-message/errorMessage.controller.js';

async function initCayenne() {
	const appEl = document.getElementById('app');
	await initCayenneApp(appEl);
}

initCayenne();
