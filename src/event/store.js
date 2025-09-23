/**
 * @typedef {import('./eventEmitter.js').Listener} Listener
 * @typedef {import('./eventEmitter.js').ChainableReturnType} EmitterChain
 * @typedef {import('../types/stateTypes.js').PartialAppState} PartialAppState
 */

/**
 * @typedef {Object} StoreChainApi
 * @property {function(): StoreChainApi} unsubscribe
 * @property {function(): StoreChainApi} once
 * @property {function(): StoreChainApi} immediate
 * @property {function(Listener): StoreChainApi} tap
 */

import CayenneEventEmitter from './eventEmitter.js';

const STATE_CHANGE = 'state:change';
export function createStateStore(initialState = {}) {
	const emitter = new CayenneEventEmitter();

	/** @type {PartialAppState} */
	let state = { ...initialState };

	/**
	 *
	 * @param {PartialAppState} updates
	 */
	function setState(updates) {
		state = { ...state, ...updates };

		// Emit granular events for single-key updates; fallback to state:change
		const keys = Object.keys(updates);
		if (keys.length === 1) {
			const key = keys[0];
			switch (key) {
				case 'measureSystem':
					emitter.publish('state:measureSystem', state.measureSystem);
					break;
				case 'unitLength':
					emitter.publish('state:unitLength', state.unitLength);
					break;
				case 'recipeResults':
					emitter.publish('state:recipeResults', state.recipeResults);
					break;
				case 'currentRecipe':
					emitter.publish('state:currentRecipe', state.currentRecipe);
					break;
				case 'searchQuery':
					emitter.publish('state:searchQuery', state.searchQuery);
					break;
				case 'activeFilters':
					emitter.publish('state:activeFilters', state.activeFilters);
					break;
				case 'loading':
					emitter.publish('state:loading', state.loading);
					break;
				case 'error':
					emitter.publish('state:error', state.error);
					break;
				default:
					emitter.publish('state:change', { ...state });
			}
		} else {
			emitter.publish('state:change', { ...state });
		}
	}

	/**
	 * Helper function to minimise repetition
	 *
	 * @param {*} state
	 * @param {*} key
	 * @returns
	 */
	function getListenerArg(state, key) {
		if (!key) return { ...state };
		const val = state[key];
		if (typeof val === 'object' && val !== null) {
			return { ...val };
		}
		return val;
	}

	/**
	 *
	 * @param {Listener} listener
	 * @param {string} [key=null]
	 * @param {boolean} [emitCurrent=false]
	 * @returns {StoreChainApi}
	 */
	function subscribe(listener, key = null, emitCurrent = false) {
		const event = key ? `state:${key}` : STATE_CHANGE;

		const emitterChain = emitter.subscribe(event, () => {
			listener(getListenerArg(state, key));
		});
		return makeStoreApi(emitterChain, listener, key);
	}

	/**
	 *
	 * @param {EmitterChain} emitterChain
	 * @param {Listener} listener
	 * @param {string|null} key
	 * @returns {StoreChainApi}
	 */
	function makeStoreApi(emitterChain, listener, key) {
		const chain = {
			immediate: () => {
				listener(getListenerArg(state, key));
				return chain;
			},
			unsubscribe: () => {
				emitterChain.unsubscribe();
				return chain;
			},
			/**
			 *
			 * @param {function()} fn
			 * @returns
			 */
			tap: fn => makeStoreApi(emitterChain.tap(fn), listener, key),
			once: () => makeStoreApi(emitterChain.once(), listener, key)
		};
		return chain;
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
