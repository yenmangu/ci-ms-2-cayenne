/**
 * @typedef {import('../types/recipeTypes.js').RecipeCard} RecipeCard
 */

/**
 * @typedef {import('./eventEmitter.js').Listener} Listener
 * @typedef {import('./eventEmitter.js').ChainableReturnType} EmitterChain
 * @typedef {import('../types/stateTypes.js').PartialAppState} PartialAppState
 */

/**
 * @callback StoreListener
 * @param {PartialAppState} state
 * @param {...*} [args]
 * @returns {*}
 */

/**
 * @typedef {Object} StoreChainApi
 * @property {function(): StoreChainApi} unsubscribe
 * @property {function(): StoreChainApi} once
 * @property {function(): StoreChainApi} immediate
 * *Immediately* receive current state
 * @property {function(Listener): StoreChainApi} tap
 * *Tap* into the subscription pipeline
 * - Returns a new subscription pipeline
 */

import CayenneEventEmitter from './eventEmitter.js';

const STATE_CHANGE = 'state:change';
const CAYENNE_STATE = 'cayenneUserState';
export function createStateStore(initialState = {}) {
	const emitter = new CayenneEventEmitter();

	/** @type {PartialAppState} */
	let state = { ...initialState, isInitial: true };

	/**
	 *
	 * @param {PartialAppState} updates
	 * @param {Object} opts
	 * @param {boolean} [opts.global=true]
	 */
	function setState(updates, opts = {}) {
		state = { ...state, ...updates };
		persistState();
		if (opts.global) {
			emitter.publish(STATE_CHANGE, { ...updates });
			return;
		}

		// debugger;

		// emitter.publish(STATE_CHANGE, { ...updates });
		// return;

		// Emit granular events for single-key updates; fallback to state:change
		const keys = Object.keys(updates);
		if (keys.length === 1) {
			const key = keys[0];

			switch (key) {
				case 'unitLocale':
					emitter.publish('state:unitLocale', {
						[key]: state.unitLocale
					});
					break;
				case 'unitLength':
					emitter.publish('state:unitLength', {
						[key]: state.unitLength
					});
					break;
				case 'recipeResults':
					emitter.publish('state:recipeResults', {
						[key]: state.recipeResults
					});
					break;
				case 'currentRecipe':
					emitter.publish('state:currentRecipe', {
						[key]: state.currentRecipe
					});
					break;
				case 'searchQuery':
					emitter.publish('state:searchQuery', {
						[key]: state.searchQuery
					});
					break;
				case 'activeFilters':
					emitter.publish('state:activeFilters', {
						[key]: state.activeFilters
					});
					break;
				case 'loading':
					emitter.publish('state:loading', {
						[key]: state.loading
					});
					break;
				case 'error':
					emitter.publish('state:error', { [key]: state.error });
					break;
				default:
					emitter.publish('state:change', { ...state });
			}
		} else {
			emitter.publish('state:change', { ...state });
		}
	}

	/**
	 *
	 * @param {RecipeCard} recipe
	 */
	function saveRecipe(recipe) {
		const { likedRecipes = [] } = state;
		if (!likedRecipes.some(r => r.id === recipe.id)) {
			setState({ likedRecipes: [...likedRecipes, recipe] });
		}
	}

	/**
	 *
	 * @param {number} recipeId
	 */
	function removeLikedRecipe(recipeId) {
		const { likedRecipes = [] } = state;
		setState({ likedRecipes: likedRecipes.filter(r => r.id !== recipeId) });
	}

	/**
	 *
	 * @param {RecipeCard} recipe
	 */
	function toggleLikedrecipe(recipe) {
		const { likedRecipes = [] } = state;
		const exists = likedRecipes.some(r => r.id === recipe.id);
		if (exists) {
			setState({ likedRecipes: likedRecipes.filter(r => r.id !== recipe.id) });
		} else {
			setState({ likedRecipes: [...likedRecipes, recipe] });
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
			return { ...{ [key]: val } };
		}
		return { [key]: val };
	}

	/**
	 *
	 * @param {StoreListener} [listener]
	 * @param {string} [key=null]
	 * @returns {StoreChainApi}
	 */
	function subscribe(listener, key = null) {
		console.log('Subscribing with: ', key);

		// debugger;
		const event = key ? `state:${key}` : STATE_CHANGE;

		const emitterChain = emitter.subscribe(
			event,
			(eventName, data, ...args) => {
				listener(getListenerArg(state, key));
			}
		);
		return makeStoreApi(emitterChain, listener, key);
	}

	/**
	 *
	 * @param {EmitterChain} emitterChain
	 * @param {StoreListener} listener
	 * @param {string|null} key
	 * @returns {StoreChainApi}
	 */
	function makeStoreApi(emitterChain, listener, key) {
		const chain = {
			immediate: (data, ...args) => {
				listener(data, ...args);
				return chain;
			},
			unsubscribe: () => {
				emitterChain.unsubscribe();
				return chain;
			},
			/**
			 *
			 * @param {Listener} fn
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

	async function resetState() {
		await resetLocalStorage();
		state = { ...initialState };
		emitter.publish('state:change', { ...state });
	}

	function persistState() {
		const { likedRecipes, unitLocale } = state;
		localStorage.setItem(
			CAYENNE_STATE,
			JSON.stringify({ likedRecipes, unitLocale })
		);
	}

	async function resetLocalStorage() {
		return new Promise(resolve => {
			localStorage.removeItem(CAYENNE_STATE);
			resolve();
		});
		// localStorage.removeItem(CAYENNE_STATE);
	}

	return {
		setState,
		getState,
		subscribe,
		dispatch,
		resetState,
		saveRecipe,
		removeLikedRecipe,
		toggleLikedrecipe
	};
}
