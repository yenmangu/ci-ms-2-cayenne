/**
 * @typedef {import('../types/recipeTypes.js').RecipeCard} RecipeCard
 * @typedef {import('../types/recipeTypes.js').ExtendedIngredient} ExtendedIngredient
 * @typedef {import('../types/stateTypes.js').ShoppingListItem} ShoppingListItem
 */

/**
 * @typedef {import('./eventEmitter.js').Listener} Listener
 * @typedef {import('./eventEmitter.js').ChainableReturnType} EmitterChain
 * @typedef {import('../types/stateTypes.js').PartialAppState} PartialAppState
 * @typedef {import('../types/stateTypes.js').StateKey} StateKey
 */

/**
 * @typedef {import('../types/errorTypes.js').NormalisedError} NormalisedError
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
	 * @param {object} opts
	 * @param {boolean} [opts.global=true]
	 */
	function setState(updates, opts = {}) {
		state = { ...state, ...updates };
		persistState();
		if (opts.global) {
			emitter.publish(STATE_CHANGE, { ...updates });
			return;
		}

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
				case 'likedRecipes':
					emitter.publish('state:likedRecipes', {
						[key]: state.likedRecipes
					});
					break;
				case 'shoppingList':
					emitter.publish('state:shoppingList', {
						[key]: state.shoppingList
					});
					break;
				case 'route':
					emitter.publish('state:route', {
						[key]: state.route
					});
					break;
				case 'loading':
					emitter.publish('state:loading', {
						[key]: state.loading
					});
					break;
				case 'useLive':
					emitter.publish('state:useLive', {
						[key]: state.useLive
					});
					break;
				case 'errors':
					emitter.publish('state:errors', { [key]: state.errors });
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
	 * @param {ShoppingListItem} ingredient
	 */
	function addToCart(ingredient) {
		const { shoppingList = [] } = state;
		if (!shoppingList.some(i => i.id === ingredient.id)) {
			setState({ shoppingList: [...shoppingList, ingredient] });
		}
	}

	/**
	 *
	 * @param {ShoppingListItem} ingredient
	 */
	function removeFromCart(ingredient) {
		const { shoppingList = [] } = state;
		setState({
			shoppingList: shoppingList.filter(i => i.id !== ingredient.id)
		});
	}

	/**
	 *
	 * @param {ShoppingListItem} ingredient
	 */
	function toggleIngredientInCart(ingredient) {
		const { shoppingList = [] } = state;
		const exists = shoppingList.some(i => i.id === ingredient.id);
		if (exists) {
			removeFromCart(ingredient);
		} else {
			addToCart(ingredient);
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
	 *
	 * @param {string} string
	 */
	function addSearchString(string) {
		const { searchQuery = [] } = state;

		const exists = searchQuery.some(s => s === string);
		if (!exists) {
			searchQuery.push(string);
		}
		setState({ searchQuery: searchQuery });
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
	 * @param {StateKey} [key=null]
	 * @returns {StoreChainApi}
	 */
	function subscribe(listener, key = null) {
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
			immediate: () => {
				listener(getListenerArg(state, key));
				return chain;
			},

			once: () => makeStoreApi(emitterChain.once(), listener, key),
			/**
			 *
			 * @param {Listener} fn
			 * @returns
			 */
			tap: fn => makeStoreApi(emitterChain.tap(fn), listener, key),
			unsubscribe: () => {
				emitterChain.unsubscribe();
				return chain;
			}
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
			return action({ dispatch, getState, resetState, setState, subscribe });
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
		const { likedRecipes, shoppingList, unitLocale, useLive } = state;
		localStorage.setItem(
			CAYENNE_STATE,
			JSON.stringify({ likedRecipes, shoppingList, unitLocale, useLive })
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
		addSearchString,
		dispatch,
		getState,
		removeLikedRecipe,
		resetState,
		saveRecipe,
		setState,
		subscribe,
		toggleIngredientInCart,
		toggleLikedrecipe
	};
}
