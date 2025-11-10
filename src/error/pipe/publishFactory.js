/**
 * @typedef {import("../../types/stateTypes.js").AppStore} AppStore
 * @typedef {import("../../types/errorTypes.js").NormalisedError} NormalisedError
 * @typedef {import("../../types/stateTypes.js").ErrorMeta} ErrorMeta
 * @typedef {import("../../types/stateTypes.js").ErrorMetas} ErrorMetas
 * @typedef {import("../../types/stateTypes.js").ErrorScope} ErrorScope
 * @typedef {import('../../types/errorTypes.js').Decision} Decision
 */

import { createDeduper } from './deduper.js';
import { normaliseError } from './normaliser.js';
import { applyErrorPolicy } from './policy.js';
import { addError, publishDecision } from './publish.js';

/**
 * @typedef {object} PublisherDependencies
 * @property {{typeof: normaliseError}} [normaliseError]
 * @property {{typeof: applyErrorPolicy}} [applyErrorPolicy]
 * @property {{typeof: publishDecision}} [publishDecision]
 * @property {{typeof: ReturnType<createErrorPublishing>}} [publishers]
 * @property {{typeof: ReturnType<createDeduper>}} [deduper]
 */

/**
 * Public API for the error publishing bundle returned by `createErrorPublishing`.
 *
 * @typedef {object} ErrorPublishers
 * @property {(
 * 	store: AppStore,
 * 	scope: ErrorScope,
 * 	source: unknown,
 * 	meta: ErrorMeta,
 * 	detailString?: string,
 * 	response?: Response | {}
 *	 ) => void } routeError
 * @property {(store: AppStore, normalisedError: NormalisedError, scope:ErrorScope) => void} reportError
 * @property {(store: AppStore, scope: ErrorScope, meta: ErrorMeta) => void} reportRefetch
 * @property {(store: AppStore, scope: ErrorScope, metas: ErrorMetas) => void} reportRefetchMany
 * @property {(store: AppStore, scope: ErrorScope, opts: Record<string, any>) => void} reportNotFound
 * @property {(store: AppStore) => void} switchToTestOnce
 */

import { appStore } from '../../appStore.js';
import { serialiseError } from '../util/serialiseError.js';
/**
 *
 * @returns {ErrorPublishers}
 */
export function createErrorPublishing() {
	return {
		routeError(store, scope, source, meta, detailString, response, deps = {}) {
			const _normaliseError = deps.normaliseError ?? normaliseError;
			const _applyErrorPolicy = deps.applyErrorPolicy ?? applyErrorPolicy;
			const _publishDecision = deps.publishDecision ?? publishDecision;
			const publishers = deps.publishers ?? createErrorPublishing();
			const deduper = deps.deduper ?? createDeduper();
			console.log('error publishing creation');

			if (appStore.getState().devMode) {
				// if (source instanceof Error) throw source;
				// Uncomment for dev logging
				console.trace(
					'Logging for brevity: ',
					source,
					' 	response: ',
					response,
					'  meta: ',
					meta
				);
			}
			// Build hints once: include transport/meta and serialised stack/cause.
			const hints = {
				context: { ...meta },
				details: serialiseError(source)
			};

			// Normalise the "source" into an error-like shape for the normaliser.
			let errLike = source;

			// If caller passed a bare status code, wrap it.
			if (typeof source === 'number') {
				errLike = {
					name: 'HttpError',
					status: source,
					message: detailString || `HTTP ${source}`
				};
			}

			// If caller passed a Response, wrap its status (discouraged at call-sites, but supported).
			if (
				source &&
				typeof source === 'object' &&
				'status' in source &&
				'ok' in source
			) {
				const s = /** @type {Response} */ (source).status;
				errLike = {
					name: 'HttpError',
					status: s,
					message: detailString || `HTTP ${s}`
				};
			}

			/** @type {NormalisedError} */
			const n = _normaliseError(errLike, hints);
			const decision = _applyErrorPolicy(n);

			// Use a stable object as a dedupe key (Response preferred, else the error-like object).
			const dedupeKey =
				response && typeof response === 'object'
					? response
					: errLike && typeof errLike === 'object'
					? errLike
					: undefined;

			_publishDecision(
				store,
				scope,
				n,
				decision,
				dedupeKey,
				publishers,
				deduper
			);
		},

		/**
		 *
		 * @param {AppStore} store
		 * @param {NormalisedError} normalisedError
		 */
		reportError(store, normalisedError, scope) {
			store.dispatch(addError(normalisedError, scope));
		},

		/**
		 *
		 * @param {AppStore} store
		 * @param {ErrorScope} scope
		 * @param {ErrorMeta} meta
		 */
		reportRefetch(store, scope, meta) {
			const { endpoint, opts, params, urlAbs: url, status } = meta;

			/** @type {NormalisedError} */
			const retryable = {
				code: 'RETRYABLE',
				context: { cmd: 'refetch', endpoint, opts, params, url },
				retry: true,
				type: 'network',
				userMessage:
					status === 402
						? 'API quota exceeded (402) - retry with test data from Cayenne API'
						: 'Network issue. Please try again.'
			};
			store.dispatch(addError(retryable, scope));
		},
		reportNotFound(store, scope, opts = {}) {
			const {
				code = 'ROUTE_404', // distinguish from HTTP_404
				userMessage = "That page doesn't exist.", // UI copy for router misses
				path // optional: the hash/path we tried
			} = opts;

			/** @type {NormalisedError} */
			const n = {
				code,
				type: 'not_found',
				userMessage,
				// context can carry UI-only hints (no scope, no transport)
				context: path ? { path } : undefined
				// no status, no retry
			};

			// Scope stays separate (canonical)
			store.dispatch(addError(n, scope));
		},

		/**
		 *
		 * @param {AppStore} store
		 */
		switchToTestOnce(store) {
			const { useLive } = store.getState();
			if (useLive) store.setState({ useLive: false });
		},

		/**
		 *
		 * @param {AppStore} store
		 * @param {ErrorScope} scope
		 * @param {ErrorMetas} metas
		 */
		reportRefetchMany(store, scope, metas) {
			store.dispatch(
				addError(
					{
						code: 'RETRYABLE_MANY',
						type: 'network',
						retry: true,
						userMessage: 'Network issue. Please try again.',
						context: { cmd: 'refetchMany', metas } // transport-only
					},
					scope
				)
			); // scope passed separately
		}
	};
}
/** @type {ErrorPublishers | undefined} */
let _publishers;
/**
 *
 * @returns {ErrorPublishers}
 */
export function getPublishers() {
	return (_publishers ??= createErrorPublishing());
}
