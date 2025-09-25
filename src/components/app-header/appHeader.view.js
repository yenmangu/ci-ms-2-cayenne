/**
 * Renders the appHeader component to the DOM
 *
 */

export function renderAppHeader() {
	// TODO: implment view logic

	return `<!-- App Header Slice -->
<header class="app-header shadow-sm">
  <div class="app-header__left ">
    <img src="/assets/images/logo/cayenne-logo.png" alt="Cayenne Logo" class="app-header__logo me-2" height="28" />
    <span class="app-header__title fw-bold">Cayenne</span>
  </div>
  <div class="app-header__toggles d-flex align-items-center gap-2">
    <div class="toggle-container">
      <p>Units</p>
    </div>
  </div>
  <!-- For future: burger menu or user icon -->
</header>
`;
}
