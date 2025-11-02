/**
 * @typedef {import('../../types/stateTypes.js').AppStore}AppStore
 * @typedef {import('../../types/stateTypes.js').ErrorScope} ErrorScope
 * @typedef {import('./error.view.js').ErrorRenderMode} ErrorRenderMode
 * @typedef {import('../../types/stateTypes.js').ErrorEntry}ErrorEntry
 */

import * as service from './error.service.js';
import { renderError } from './error.view.js';
import { resolveError } from './error.model.js';
import { reportError } from '../../error/errorReporter.js';
import { getClient } from '../../api/client.singleton.js';

/**
 * ErrorController class renders latest error for a given scope.
 * It listens to 'state:errors;' and re-renders on change
 *
 */
export class ErrorController {
	#_sub;

	/**
	 * @param {HTMLElement} container
	 * @param {{
	 * store?: AppStore,
	 * scope?: ErrorScope,
	 * mode?: ErrorRenderMode,
	 * title?: string
	 * }} opts
	 *
	 */
	constructor(container, { store, scope, mode = 'inline', title } = {}) {
		/** @type {HTMLElement} */
		this.el = container;

		/** @type {AppStore}*/ this.store = store;
		/** @type {ErrorScope} */ this.scope = scope;
		/** @type {ErrorRenderMode} */ this.mode = mode;
		/** @type {string|undefined} */ this.title = title;

		this.#_sub = null;
	}

	init() {
		this.#_sub = this.store
			.subscribe(({ errors }) => {
				this.render(errors);
			}, 'errors')
			.immediate();
	}

	/**
	 *
	 * @param {ErrorEntry[]} errors
	 */
	render(errors) {
		// Fallback if render() is called without args
		const list = errors ?? (this.store.getState().errors || []);
		const entry = list.filter(e => e.scope === this.scope).at(-1);

		if (!entry) {
			this.el.innerHTML = '';
			return;
		}

		const onRetry = this.#_deriveRetry(entry);
	}

	/**
	 *
	 * @param {ErrorEntry} entry
	 */
	#_deriveRetry(entry) {
		const meta = entry.meta || {};
		switch (meta.cmd) {
			case 'refetch':
				if (meta.url) {
					return async () => {
						await fetch(meta.url, meta.opts);
					};
				}
				if (meta.endpoint) {
					return async () => {
						await getClient().refetch(meta.endpoint, meta.params);
					};
				}
				return null;
			case 'reloadRoute':
				return async () => {
					window.location.reload();
				};
			case 'retryAction':
				// future action registry
				return null;
			default:
				return null;
		}
	}

	/**
	 *
	 * @param {ErrorEntry} entry
	 * @param {()=> any} onRetry
	 */
	#_wireHandlers(entry, onRetry) {
		const root = this.el.querySelector('[data-error-root]');
		if (!root) return;

		const dismissBtn = /** @type {HTMLElement} */ (
			root.querySelector('[data-error-dismiss]')
		);
		if (dismissBtn) {
			dismissBtn.addEventListener(
				'click',
				() => {
					const list = this.store.getState().errors || [];
					this.store.setState({ errors: resolveError(list, entry.id) });
				},
				{ once: true }
			);
		}
		const retryBtn = /** @type {HTMLElement} */ (
			root.querySelector('[data-error-retry]')
		);
		if (retryBtn && dismissBtn) {
			retryBtn.addEventListener(
				'click',
				async () => {
					try {
						await onRetry();
						const list = this.store.getState().errors || [];
						this.store.setState({ errors: resolveError(list, entry.id) });
					} catch (err) {
						reportError(this.store, err, {
							context: { scope: this.scope, cmd: 'refetch' }
						});
					}
				},
				{ once: true }
			);
		}
	}

	destroy() {
		console.warn('Function destroy() not yet implemented.');
	}
}
