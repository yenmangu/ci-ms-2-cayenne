/**
 * @typedef {import('./types/stateTypes.js').AppState} AppState
 * @typedef {import('./types/stateTypes.js').PersistableState} PersistableState
 */

import { createStateStore } from './event/store.js';
const persisted = localStorage.getItem('cayenneUserState');

/** @type {PersistableState} */
let userState = {};
try {
	const raw = localStorage.getItem('cayenneUserState');
	if (raw) {
		const parsed = JSON.parse(raw) ?? {};
		const {
			likedRecipes = [],
			unitLocale = 'metric',
			shoppingList = [],
			useLive = false
		} = parsed;
		userState = { likedRecipes, unitLocale, shoppingList, useLive };
	}
} catch {
	userState = {};
}

/** @type {AppState} */
const initialState = {
	devMode: true,
	currentRecipe: null,
	likedRecipes: [],
	recipeResults: [],
	shoppingList: [],
	unitLength: 'unitShort',
	unitLocale: 'metric',
	useLive: false,
	...userState
};

const cayenneStateStore = createStateStore(initialState);

export { cayenneStateStore as appStore };
