import { AppHeader } from './components/app-header/appHeader.controller.js';
import { isProd } from './env.js';
import { initNavbar } from './global-ui/navbar.js';
import { startRouter } from './router/appRouter.js';
import { initDevBootstrap } from './util/dev/devBoostrap.js';
import { initStickyFooter } from './util/footerOffsets.js';
import { initAppHeader } from './util/responsiveHeader.js';

import {
	configureIconBaseDir,
	preloadIcons
} from './util/icon/icon-component/icon.service.js';

import { appStore } from './appStore.js';
import { installGlobalErrorHooks } from './error/util/installGlobalErrorHooks.js';

let appHeader = null;
let devMode = true;

/**
 * Single point of logic for collecting 'appRoot' element.
 * Injects appRoot into the rest of the cayenne app.
 *
 */
async function initCayenne() {
	// Start error handling instantly
	appStore.setState({ devMode: devMode });
	installGlobalErrorHooks(appStore);

	// Dev logging
	console.log('isProd? ', !!isProd);

	initNavbar();
	// Main injection site
	const appRoot = document.getElementById('app-root');
	appHeader = new AppHeader(appRoot, !isProd);

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
	startRouter(appRoot);
}

window.addEventListener('DOMContentLoaded', () => {
	initDevBootstrap({ forceView: true });
	initCayenne();
	initStickyFooter();
	initAppHeader(appHeader, 300);

	/* ===== enable probe only when requested ===== */
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
	/* ================== end dev ================= */
});
