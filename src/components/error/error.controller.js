/**
 * @typedef {import('../../types/stateTypes.js').AppStore}AppStore
 * @typedef {import('../../types/stateTypes.js').ErrorScope} ErrorScope
 * @typedef {import('./error.view.js').ErrorRenderMode} ErrorRenderMode
 * @typedef {import('../../types/stateTypes.js').ErrorEntry}ErrorEntry
 * @typedef {import('../../event/store.js').StoreChainApi} StoreChainApi
 */

import { getClient } from '../../api/client.singleton.js';
import { reportError } from '../../error/errorReporter.js';
import { resolveError } from './error.model.js';
import { renderError } from './error.view.js';

/**
 * ErrorController class renders latest error for a given scope.
 * It listens to 'state:errors;' and re-renders on change
 *
 */
export class ErrorController {
	/** @type {StoreChainApi} */
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
	constructor(container, { mode = 'inline', scope, store, title } = {}) {
		/** @type {HTMLElement} */
		this.el = container;

		/** @type {AppStore}*/ this.store = store;
		/** @type {ErrorScope} */ this.scope = scope;
		if (!this.store) throw new Error('[ErrorController] store is required');
		if (!this.scope) throw new Error('[ErrorController] scope is required');

		/** @type {ErrorRenderMode} */ this.mode = mode;
		/** @type {string|undefined} */ this.title = title;

		this.#_sub = null;
	}

	/**
	 *
	 * @param {ErrorEntry} entry
	 */
	#_deriveRetry(entry) {
		const meta = entry.meta || {};
		switch (meta.cmd) {
			case 'refetch':
				return async () => {
					await getClient().refetchFromMeta(meta);
				};
			case 'reloadRoute':
				return async () => {
					window.location.reload();
				};
			case 'retryAction':
				// future action registry hook
				return null;
			default:
				return null;
		}
	}

	/**
	 *
	 * @param {ErrorEntry} entry
	 * @param {(()=> Promise<any|null>)} onRetry
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
		if (retryBtn && onRetry) {
			retryBtn.addEventListener(
				'click',
				async () => {
					try {
						await onRetry();
						const list = this.store.getState().errors || [];
						this.store.setState({ errors: resolveError(list, entry.id) });
					} catch (err) {
						reportError(this.store, err, {
							context: { cmd: 'refetch', scope: this.scope }
						});
					}
				},
				{ once: true }
			);
		}
	}

	destroy() {
		this.#_sub?.unsubscribe();
		this.#_sub = null;
		this.el.innerHTML = '';
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

		this.el.innerHTML = renderError(
			{
				code: entry.code,
				message: entry.message,
				retry: !!onRetry,
				type: entry.type,
				userMessage: entry.userMessage
			},
			{ mode: this.mode, title: this.title }
		);
		this.#_wireHandlers(entry, onRetry);
	}
}
