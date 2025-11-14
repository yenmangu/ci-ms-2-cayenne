/**
 * @typedef {import("../../types/stateTypes.js").AppStore} AppStore
 * @typedef {import("../../types/errorTypes.js").NormalisedError} NormalisedError
 * @typedef {import("../../types/errorTypes.js").ErrorMeta} ErrorMeta
 * @typedef {import("../../types/stateTypes.js").ErrorScope} ErrorScope
 * @typedef {import('../../types/errorTypes.js').Decision} Decision
 * @typedef {import('../../types/stateTypes.js').StoreAction} StoreAction
 */

import { pushError } from '../error.model.js';
import { extractMeta } from '../util/extractMeta.js';
import { createDeduper } from './deduper.js';
import { normalisedToEntry } from './normaliser.js';
import { createErrorPublishing } from './publishFactory.js';

/**
 *
 * @param {AppStore} store
 * @param {ErrorScope} scope
 * @param {NormalisedError} norm
 * @param {Decision} decision
 * @param {any} [dedupeKey]
 */
export function publishDecision(
	store,
	scope,
	norm,
	decision,
	dedupeKey,
	publishers = createErrorPublishing(),
	deduper = createDeduper()
) {
	const once = deduper.once;
	const switchToTestOnce = publishers.switchToTestOnce;

	const context = norm.context ?? {};
	const params = context.params ?? {};
	const meta = extractMeta(norm);
	// /** @param {Decision} decision */
	switch (decision.kind) {
		case 'show': {
			if (!once(dedupeKey)) {
				console.log('Duplicate error');

				return;
			}
			/** @type {NormalisedError} */
			const entry =
				norm.status === 402
					? {
							...norm,
							retry: true,
							context: {
								...context,
								params: { ...params, refetch: true, useCache: true }
							}
					  }
					: { ...norm, context };

			if (norm.status === 402) {
				switchToTestOnce(store);
			}

			if (norm.type === 'ERR_CONNECTION_REFUSED') {
				console.log('[publishDecision]: connection_refused: ', norm);
			}
			publishers.reportError(store, entry, scope);

			break;
		}
		case 'retry': {
			if (!once(dedupeKey)) return;
			publishers.reportRefetch(store, scope, meta);
			break;
		}
		case 'none': {
			if (!once(dedupeKey)) return;
			const entry = {
				...norm,
				context
			};
			publishers.reportError(store, entry, scope);
		}
	}
}

/**
 *
 * @param {NormalisedError} n
 * @param {ErrorScope} scope
 * @returns {StoreAction}
 */
export function addError(n, scope) {
	/** @type {StoreAction} */
	return function thunk(ctx) {
		const { getState, setState } = ctx;
		const entry = normalisedToEntry(n, scope);
		const next = pushError(getState().errors || [], entry);
		setState({ errors: next });
		// const next = pushError(entry,next)
	};
}
