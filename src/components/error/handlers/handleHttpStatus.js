/**
 * @typedef {import("../../../types/stateTypes.js").AppStore} AppStore
 * @typedef {import("../../../types/errorTypes.js").ErrorScope} ErrorScope
 * @typedef {import("../../../types/stateTypes.js").ErrorMeta} ErrorMeta
 */

import { reportError, reportRefetch } from '../../../error/errorReporter.js';
import { handleQuotaExceed } from './handle402.js';

/**
 *
 * @param {AppStore} store
 * @param {ErrorScope} scope
 * @param {number} status
 * @param {ErrorMeta} meta
 * @param {string} detail
 */
export function handleHttpStatus(store, scope, status, meta, detail) {
	// Explicit paths first

	if (status === 402) {
		handleQuotaExceed(store, scope, meta);
		return;
	}

	if (status === 404) {
		reportError(
			store,
			new Error(`HTTP 404: Not Found${detail ? ` - ${detail}` : ''}`),
			{
				code: 'API_404',
				context: { scope, ...meta },
				type: 'not_found',
				userMessage:
					"We couldn't find that specific resource. It may have been moved or removed."
			}
		);
		return;
	}

	if (status === 439) {
		reportRefetch(store, scope, {
			...meta
		});
		return;
	}

	if (status >= 500 && status <= 599) {
		// Server Faults
		reportRefetch(store, scope, { ...meta });
	}

	// Generic client errors (400/401/403/409 etc..)
	reportError(
		store,
		new Error(`HTTP ${status}${detail ? ` - ${detail}` : ''}`),
		{
			code: `HTTP_${status}`,
			context: { scope, ...meta },
			type: 'network',
			userMessage:
				status === 401
					? 'Authentication failed. Check your API configuration.'
					: status === 403
					? 'Access denied. This request is not permitted.'
					: 'Something went wrong with your request.'
		}
	);
}
