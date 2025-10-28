/**
 * @typedef {import('./components/error-message/errorMessage.controller.js').ErrorMessageConfig} ErrorConfig
 */

import { initNavbar } from './global-ui/navbar.js';
import { ErrorMessage } from './components/error-message/errorMessage.controller.js';
import { startRouter } from './router/appRouter.js';
import { AppHeader } from './components/app-header/appHeader.controller.js';
import { isProd } from './env.js';
import { initAppHeader } from './util/responsiveHeader.js';
import { initDevBootstrap } from './util/dev/devBoostrap.js';
import { initStickyFooter } from './util/footerOffsets.js';

import {
	configureIconBaseDir,
	preloadIcons
} from './util/icon/icon-component/icon.service.js';

// Dev
import { ensureDev, getDevWindow } from './util/dev/devWindow.js';
import { startPaddingProbe } from './util/dev/probes.js';

let appHeader = null;

/**
 * Single point of logic for collecting 'appRoot' element.
 * Injects appRoot into the rest of the cayenne app.
 *
 */
async function initCayenne() {
	console.log('isProd? ', isProd);
	// initStateStore();
	initNavbar();
	// Main injection site
	const appRoot = document.getElementById('app-root');
	appHeader = new AppHeader(appRoot, !isProd);
	const headerStack = document.getElementById('header-stack');

	appRoot.insertAdjacentElement('beforebegin', appHeader.header);

	configureIconBaseDir('/assets/images/icon');
	const appIcons = [
		'house-regular',
		'house-solid',
		'cart-regular',
		'cart-solid',
		'bookmark-regular',
		'bookmark-solid'
	];
	await preloadIcons(appIcons);

	if (appHeader) appHeader.init();

	// Start the client-side routing
	console.log('Starting router');

	startRouter(appRoot);
}

window.addEventListener('DOMContentLoaded', () => {
	initDevBootstrap({ forceView: true });
	initCayenne();
	initStickyFooter();
	initAppHeader(appHeader, 300);

	// ---- enable the probe only when requested (and not in prod) ----
	// const probeOn =
	// 	!isProd && new URLSearchParams(location.search).has('probePadding');
	// if (probeOn) {
	// 	// Run as soon as the page is shown after navigation/refresh
	// 	window.addEventListener(
	// 		'pageshow',
	// 		() => {
	// 			const main = /** @type {HTMLElement|null} */ (
	// 				document.querySelector('main#cayenne-main')
	// 			);
	// 			if (!main) {
	// 				console.warn('[probe] main#cayenne-main not found');
	// 			} else {
	// 				// kicks off frame-by-frame logging immediately
	// 				const stop = startPaddingProbe(main, 'main#cayenne-main');
	// 				const w = getDevWindow();
	// 				const dev = ensureDev(w);
	// 				// optional auto-stop after 5s (you can also call window.__stopPaddingProbe() in console)
	// 				setTimeout(() => dev.__stopPaddingProbe?.(), 5000);
	// 			}
	// 		},
	// 		{ once: true }
	// 	);
	// }
	// ----------------------------------------------------------------
});
