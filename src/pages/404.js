/**
 * @typedef {import("../types/routerTypes.js").RouteHandler} Handler
 */
/**
 * 404 page route handler method
 */

import { stringToHtml } from '../util/htmlToElement.js';

/**
 *
 * @param {HTMLElement} appRoot
 * @param {string} pathName
 * @param {Record<string, any>} params
 */
export function loadNotFoundPage(appRoot, pathName, params = {}) {
	const html = renderNotFound({ pathName: pathName ?? '' });
	const node = stringToHtml(html);
	appRoot.replaceChildren(node);

	const heading = /** @type {HTMLElement} */ (
		appRoot.querySelector('.not-found h1')
	);
	if (heading) {
		// Set a11y attributes
		heading.setAttribute('tabindex', '-1');
		heading.focus({ preventScroll: false });
	}

	document.title = 'Not Found - Cayenne';
}

/**
 * Render the 404 page as an HTML string.
 * @param {{ pathName?: string }} [opts]
 * @returns {string}
 */
export function renderNotFound(opts = {}) {
	const badPath =
		opts.pathName && opts.pathName !== '/not-found'
			? decodeURIComponent(opts.pathName)
			: '';

	const detail = badPath
		? `<p class="text-muted small mb-4">Requested path: <code>${badPath}</code></p>`
		: '';

	return `
    <section class="container py-5 not-found" data-test-id="not-found">
      <div class="row justify-content-center">
        <div class="col-12 col-md-10 col-lg-8 text-center">
          <h1 class="h2 mb-3">Page not found</h1>
          <p class="text-muted mb-4">
            The page you were looking for doesn’t exist or may have moved.
          </p>
          ${detail}
          <div class="d-grid gap-2 d-sm-flex justify-content-sm-center mb-4">
            <a class="btn btn-primary btn-lg" href="#/">Back to Home</a>

          </div>
          <p class="small text-muted">
            If you typed the address, double-check the spelling.
          </p>
        </div>
      </div>
    </section>
  `;
}

`<a class="btn btn-outline-secondary btn-lg" href="#/recipes">Browse Recipes</a>
            <a class="btn btn-outline-secondary btn-lg" href="#/liked-recipes">Saved Recipes</a>`;
