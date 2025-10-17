/**
 * Renders the appHeader component to the DOM
 *
 */

export function renderAppHeader(homeLink) {
	return `<!-- App Header Slice -->
<div class="app-header shadow-sm">
  <div class="app-header__left">
    <a href="${homeLink}" class="app-header__home-link">
      <img src="./src/../assets/images/logo/cayenne-logo.png" alt="Cayenne Logo" class="app-header__logo me-2" height="28" />
      <span class="app-header__title fw-bold">Cayenne</span>
    </a>
  </div>
  <div class="app-header__nav-wrapper">

  </div>
  <div class="app-header__toggles d-flex align-items-center gap-2">
    <div class="toggle-container">
      <p>Units</p>
    </div>
  </div>
  <!-- For future: burger menu or user icon -->
</div>
`;
}

/**
 *
 * @param {import("../../types/routerTypes.js").RouteMap } routeMap
 */
export function renderAppNav(routeMap) {
	const navLinks = Object.entries(routeMap)
		.filter(([, entry]) => entry.showInNav)
		.map(([path, entry]) => renderNavLink(entry.title, `#${path}`, entry.icon))
		.join('');
	return `<nav>
			<ul class="app-header__nav-links">${navLinks}</ul>
		</nav>`;
}

/**
 *
 * @param {string} title
 * @param {string} href
 * @param {string} icon
 */
export function renderNavLink(title, href, icon) {
	return `<li>
    <a href="${href}" aria-label=${title.toLowerCase()} class="app-header__nav-link">
      <i class="fa fa-${icon}" aria-hidden=true></i>
    </a>
  </li>
  `;
}
