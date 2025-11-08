/**
 * @typedef {import("../../types/errorTypes.js").ErrorType} ErrorType
 * @typedef {import("../../types/stateTypes.js").ErrorScope} ErrorScope
 * @typedef {import("../../types/stateTypes.js").ErrorEntry} ErrorEntry
 */

import { escapeHtml } from '../../util/escapeHtml.js';

/**
 * @typedef {object} RenderErrorInput
 * @property {ErrorType} type
 * @property {string} code
 * @property {string} userMessage
 * @property {string} [message] - Optional technical detail
 * @property {boolean} [retry=false] - Show retry button?
 */

/**
 * @typedef {'inline'|'page'} ErrorRenderMode
 */

/**
 * Renders the error component to the DOM;
 * Returns a Bootstrap-flavoured alert block.
 *
 * @param {RenderErrorInput} e
 * @param {{mode?: ErrorRenderMode, title?:string}} [opts={}]
 */
export function renderError(e, opts = {}) {
	const { mode = 'inline', title } = opts;
	const isPage = mode === 'page';

	const classes =
		'alert alert-warning d-flex align-items-start gap-2 mb-3' +
		(isPage ? ' w-100' : '');

	const heading = title ? `<h3 class="h6 mb-1">${escapeHtml(title)}</h3>` : '';
	const reason = `<div class="text-muted small">(${escapeHtml(
		e.type
	)} · ${escapeHtml(e.code)})</div>`;
	const text = e.message
		? `<details class=""mt-1 small>
		<summary>Details</summary>
			<pre class="mb-0">${escapeHtml(e.message)}</pre>
		</details>`
		: '';
	return `
    <div class="${classes}" role="alert" data-error-root>
      <div class="flex-shrink-0 pt-1" aria-hidden="true">⚠️</div>
      <div class="flex-grow-1">
        ${heading}
        <p class="mb-1">${escapeHtml(e.userMessage)}</p>

        ${text}
        ${
					e.retry
						? `<button class="btn btn-sm btn-dark mt-2" data-error-retry>Retry</button>`
						: ''
				}
        <button class="btn btn-sm btn-light mt-2 ms-2" data-error-dismiss>Dismiss</button>
      </div>
    </div>
  `;
}
