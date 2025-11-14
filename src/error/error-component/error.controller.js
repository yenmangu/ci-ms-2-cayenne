/**
 * @typedef {import('../../types/stateTypes.js').AppStore}AppStore
 * @typedef {import('../../types/stateTypes.js').ErrorScope} ErrorScope
 * @typedef {import('./error.view.js').ErrorRenderMode} ErrorRenderMode
 * @typedef {import('../../types/stateTypes.js').ErrorEntry}ErrorEntry
 * @typedef {import('../../event/store.js').StoreChainApi} StoreChainApi
 * @typedef {import('../../types/errorTypes.js').ErrorMeta} ErrorMeta
 */

/**
 * Minimal interface the controller needs from the client.
 * Keeps tests easy and avoids requiring a full SpoonacularClient shape.
 * @typedef {{ refetchFromMeta(meta: any): Promise<any> }} RefetchCapableClient
 */

/**
 * Dependencies contract for DI.
 * @typedef {object} ErrorControllerDeps
 * @property {() => RefetchCapableClient} getClient
 * @property {(list: ErrorEntry[], id: string) => ErrorEntry[]} resolveError
 * @property {(store: AppStore, scope: ErrorScope, meta?: ErrorMeta) => void} reportRefetch
 */

import { getClient as _getClient } from '../../api/client.singleton.js';
import { resolveError as _resolveError } from '../error.model.js';
import { renderError as _renderError } from './error.view.js';

import { appStore } from '../../appStore.js';
import { EVENTS } from '../../config/events.js';
import { createErrorPublishing } from '../pipe/publishFactory.js';

/** @type {ErrorControllerDeps} */
const DEFAULT_DEPS = {
	/** @returns {RefetchCapableClient} */
	getClient: () => _getClient(),
	resolveError: _resolveError,
	reportRefetch: createErrorPublishing().reportRefetch
};

/**
 * ErrorController class renders latest error for a given scope.
 * It listens to 'state:errors;' and re-renders on change
 *
 */
export class ErrorController {
	/** @type {StoreChainApi} */
	#_sub;

	/**
	 * @type {ErrorControllerDeps}
	 * */
	deps;

	/**
	 * @param {HTMLElement} container
	 * @param {{
	 * store?: AppStore,
	 * scope?: ErrorScope,
	 * mode?: ErrorRenderMode,
	 * title?: string
	 * }} opts
	 * @param {Partial<ErrorControllerDeps>} [deps]
	 *
	 */
	constructor(container, { mode = 'inline', scope, store, title } = {}, deps) {
		/** @type {HTMLElement} */
		this.el = container;

		/** @type {AppStore}*/ this.store = store;
		/** @type {ErrorScope} */ this.scope = scope;
		if (!this.store) throw new Error('[ErrorController] store is required');
		if (!this.scope) throw new Error('[ErrorController] scope is required');

		/** @type {ErrorRenderMode} */ this.mode = mode;
		/** @type {string|undefined} */ this.title = title;

		this.#_sub = null;

		/** @type {ErrorControllerDeps} */
		this.deps = { ...DEFAULT_DEPS, ...(deps || {}) };
		this.pubs = createErrorPublishing();
	}

	/**
	 *
	 * @param {ErrorEntry} entry
	 * @returns {(()=> Promise<any|null>)}
	 */
	#_deriveRetry(entry) {
		const meta = entry.meta || {};
		const client = _getClient();
		const hasTransport = !!(
			meta.endpoint ||
			meta.urlAbs ||
			meta.opts ||
			meta.params
		);
		const cmd = meta.cmd ?? (hasTransport ? 'refetch' : undefined);
		switch (cmd) {
			case 'refetch':
				return async () => client.refetchFromMeta(meta);
			case 'refetchMany':
				return async () => {
					const metas = Array.isArray(meta.metas) ? meta.metas : [];
					if (!metas.length) return null;
					const results = await Promise.all(
						metas.map(m => client.refetchFromMeta(m))
					);
					return { recipe: results[0], summary: results[1] };
				};
			case 'reloadRoute':
				return async () => {
					window.location.reload();
				};

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
					this.store.setState({ errors: _resolveError(list, entry.id) });
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
						const data = await onRetry();

						const list = this.store.getState().errors || [];
						this.store.setState({ errors: _resolveError(list, entry.id) });
						const detail = { data, meta: entry.meta, scope: this.scope || {} };

						window.dispatchEvent(
							new CustomEvent(EVENTS.refetchSuccess, {
								detail: { data, meta: entry.meta, scope: this.scope || {} }
							})
						);
					} catch (err) {
						const prevMeta = entry.meta || {};

						this.pubs.reportRefetch(this.store, this.scope, prevMeta);

						// reportError(this.store, err, {
						// 	context: { cmd: 'refetch', scope: this.scope }
						// });
					}
				},
				{ once: true }
			);
		}
	}

	init() {
		this.#_sub = this.store
			.subscribe(({ errors }) => {
				console.log('Errors: ', errors);

				this.#_render(errors);
			}, 'errors')
			.immediate();
	}

	/**
	 *
	 * @param {ErrorEntry[]} errors
	 */
	#_render(errors) {
		// Fallback if render() is called without args
		const list = errors ?? (this.store.getState().errors || []);
		const entry = list.filter(e => e.scope === this.scope).at(-1);

		if (!entry) {
			this.el.innerHTML = '';
			return;
		}

		const onRetry = this.#_deriveRetry(entry);
		const isDev = appStore.getState().devMode ?? false;

		this.el.innerHTML = _renderError(
			{
				code: entry.code,
				message: entry.message,
				retry: !!onRetry,
				type: entry.type,
				userMessage: entry.userMessage,
				details: entry?.details
			},
			{ mode: this.mode, title: this.title, isDev }
		);
		this.#_wireHandlers(entry, onRetry);
	}

	destroy() {
		this.#_sub?.unsubscribe();
		this.#_sub = null;
		this.el.innerHTML = '';
	}
}
