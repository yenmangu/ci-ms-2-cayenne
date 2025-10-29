import { createNavbar } from '../templates/header.js';
import { navConfig } from './navbarConfig.js';

import { resolveActiveTitleFromBody } from '../navigation.js';

export function initNavbar() {
	const currentPageLink = resolveActiveTitleFromBody(navConfig.links);

	const header = document.getElementById('header');

	if (!header) {
		console.warn('[Cayenne] No #header found on page');
		return;
	}
	if (!currentPageLink || currentPageLink == null) {
		console.error('[Cayenne]: Current page link is null');
		return;
	}
	navConfig.activeLink = currentPageLink;
	const navEl = createNavbar({ ...navConfig });

	header.insertAdjacentElement('afterend', navEl);
}
