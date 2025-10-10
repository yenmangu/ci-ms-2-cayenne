/**
 * @typedef {import('./components/error-message/errorMessage.controller.js').ErrorMessageConfig} ErrorConfig
 */

import { initNavbar } from './global-ui/navbar.js';
import { ErrorMessage } from './components/error-message/errorMessage.controller.js';
import { startRouter } from './router/appRouter.js';
import { AppHeader } from './components/app-header/appHeader.controller.js';

import { isProd } from './env.js';
import { startPaddingProbe } from './util/.dev/probes.js';
import { initHeaderHideBehaviour } from './util/headerStack.js';
import { initAppHeader } from './util/responsiveHeader.js';
import { ensureDev, getDevWindow } from './util/.dev/devWindow.js';
let appHeader = null;
// import { updateMainOffset } from './util/headerOffsets.js';
/**
 * Single point of logic for collecting 'appRoot' element.
 * Injects appRoot into the rest of the cayenne app.
 *
 */
async function initCayenne() {
	console.log('isProd? ', isProd);

	initNavbar();
	// Main injection site
	const appRoot = document.getElementById('app-root');
	appHeader = new AppHeader(appRoot, !isProd);
	const headerStack = document.getElementById('header-stack');

	appRoot.insertAdjacentElement('beforebegin', appHeader.header);

	if (appHeader) appHeader.init();

	// Start the client-side routing
	console.log('Starting router');

	startRouter(appRoot);
}

window.addEventListener('DOMContentLoaded', () => {
	initCayenne();

	// ---- enable the probe only when requested (and not in prod) ----
	const probeOn =
		!isProd && new URLSearchParams(location.search).has('probePadding');
	if (probeOn) {
		// Run as soon as the page is shown after navigation/refresh
		window.addEventListener(
			'pageshow',
			() => {
				const main = /** @type {HTMLElement|null} */ (
					document.querySelector('main#cayenne-main')
				);
				if (!main) {
					console.warn('[probe] main#cayenne-main not found');
				} else {
					// kicks off frame-by-frame logging immediately
					const stop = startPaddingProbe(main, 'main#cayenne-main');
					const w = getDevWindow();
					const dev = ensureDev(w);
					// optional auto-stop after 5s (you can also call window.__stopPaddingProbe() in console)
					setTimeout(() => dev.__stopPaddingProbe?.(), 5000);
				}
			},
			{ once: true }
		);
	}
	// ----------------------------------------------------------------
	initAppHeader(appHeader, 300);
});
