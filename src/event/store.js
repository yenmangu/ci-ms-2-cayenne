/**
 * @typedef {import('./eventEmitter.js').Listener} Listener
 * @typedef {import('./eventEmitter.js').ChainableReturnType} Chain
 */

/**
 * @typedef {Object} StoreApi
 * @property {function(Object): void} setState
 * @property {function(): Object} getState
 * @property {function(Listener,boolean=): Chain} subscribe
 * @property {function(function(StoreApi): void|Promise<void>): void} dispatch
 * @property {function(): void} resetState
 */

import CayenneEventEmitter from './eventEmitter.js';

export function createStateStore(initialState = {}) {
	const emitter = new CayenneEventEmitter();

	let state = { ...initialState };

	function setState(updates) {
		state = { ...state, ...updates };
		emitter.publish('state:change', { ...state });
	}

	/**
	 *
	 * @param {Listener} listener
	 * @param {boolean} [emitCurrent=false]
	 * @returns {Chain}
	 */
	function subscribe(listener, emitCurrent = false) {
		if (emitCurrent) listener({ ...state });
		const sub = emitter.subscribe('state:change', listener);

		// Add logic for multiple event types

		const chain = {
			immediate: () => {
				listener({ ...state });
				return chain;
			},
			unsubscribe: () => emitter.subscribe
		};
		return sub;
	}

	function getState() {
		return { ...state };
	}

	/**
	 * Accepts either a function or an object (state patch)
	 *
	 * @param {Function|Object} action
	 * @returns
	 */
	function dispatch(action) {
		if (typeof action === 'function') {
			return action({ setState, getState, subscribe, dispatch, resetState });
		} else if (typeof action === 'object') {
			return setState(action);
		} else {
			throw new Error('Invalid action type: must be function of object');
		}
	}

	function resetState() {
		state = { ...initialState };
		emitter.publish('state:change', { ...state });
	}
	return { setState, getState, subscribe, dispatch, resetState };
}
