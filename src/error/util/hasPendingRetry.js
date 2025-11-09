/**
 * @typedef {import('../../types/stateTypes.js').AppStore} AppStore
 * @typedef {import('../../types/errorTypes.js').ErrorScope} ErrorScope
 */
export function hasPendingRetry(store, scope) {
	const list = store.getState().errors || [];
	return list.some(
		e => e.scope === scope && e.code === 'HTTP_402' && e.sticky === true
	);
}
